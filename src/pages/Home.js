import React, { useState, useRef, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Tesseract from 'tesseract.js'
import { jsPDF as JsPDF } from 'jspdf'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Home() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [enableOCR, setEnableOCR] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('txt')
  const [ocrProgress, setOcrProgress] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('eng')
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [fileId, setFileId] = useState(null)
  const [imagePreprocessing, setImagePreprocessing] = useState({
    grayscale: true,
    sharpen: true,
    contrast: true
  })
  const fileInputRef = useRef(null)

  // Available OCR languages
  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'spa', name: 'Spanish' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' }
  ]

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Subscribe to real-time comments
  useEffect(() => {
    if (fileId) {
      const subscription = supabase
        .channel('comments')
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
            filter: `file_id=eq.${fileId}`
          },
          (payload) => {
            setComments(current => [...current, payload.new])
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [fileId])

  // Fetch existing comments
  const fetchComments = async (id) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('file_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return
    }

    setComments(data || [])
  }

  // Add new comment
  const addComment = async () => {
    if (!newComment.trim() || !fileId) return

    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('comments')
      .insert([
        {
          file_id: fileId,
          user_id: user.id,
          content: newComment,
          user_email: user.email
        }
      ])

    if (error) {
      console.error('Error adding comment:', error)
      setError('Failed to add comment')
      return
    }

    setNewComment('')
  }

  const preprocessImage = async (imageData) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        if (imagePreprocessing.grayscale) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            data[i] = avg
            data[i + 1] = avg
            data[i + 2] = avg
          }
          ctx.putImageData(imageData, 0, 0)
        }

        if (imagePreprocessing.contrast) {
          ctx.filter = 'contrast(130%)'
          ctx.drawImage(canvas, 0, 0)
        }

        if (imagePreprocessing.sharpen) {
          ctx.filter = 'sharpen(1)'
          ctx.drawImage(canvas, 0, 0)
        }

        resolve(canvas.toDataURL('image/png'))
      }

      img.src = imageData
    })
  }

  const extractTextFromImage = async (file) => {
    try {
      setIsExtracting(true)
      setError(null)
      setOcrProgress(0)

      // Convert file to base64
      const reader = new FileReader()
      const base64Image = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })

      // Preprocess the image
      const processedImage = await preprocessImage(base64Image)

      // Configure Tesseract
      const result = await Tesseract.recognize(
        processedImage,
        selectedLanguage,
        {
          logger: progress => {
            if (progress.status === 'recognizing text') {
              const progressPercent = Math.round(progress.progress * 100)
              requestAnimationFrame(() => setOcrProgress(progressPercent))
            }
          }
        }
      )
      
      if (!result.data.text || result.data.text.trim() === '') {
        throw new Error('No text could be extracted from the image')
      }

      // Get confidence score
      const confidence = result.data.confidence
      
      // Clean up extracted text
      let cleanedText = result.data.text
        .replace(/[\r\n]+/g, '\n') // Normalize line breaks
        .replace(/[^\S\r\n]+/g, ' ') // Normalize spaces
        .trim()

      setExtractedText(cleanedText)
      setNotification('Text extracted successfully!')

    } catch (error) {
      console.error('Error extracting text:', error)
      setError('Failed to extract text. Please try a different image or adjust preprocessing settings.')
    } finally {
      setIsExtracting(false)
      setOcrProgress(0)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('File size must be less than 100MB')
        return
      }
      setSelectedFile(file)
      setError(null)
      setExtractedText('')

      // If OCR is enabled and file is an image, extract text
      if (enableOCR && file.type.startsWith('image/')) {
        await extractTextFromImage(file)
      }
    }
  }

  const downloadText = async (format) => {
    try {
      if (!extractedText) {
        setError('No text available to download')
        return
      }

      if (format === 'txt') {
        // Download as TXT
        const blob = new Blob([extractedText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'extracted-text.txt'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        // Download as PDF
        const doc = new JsPDF()
        
        // Split text into lines to fit PDF page
        const lines = doc.splitTextToSize(extractedText, 180)
        
        // Add text to PDF
        doc.setFont('helvetica')
        doc.setFontSize(12)
        doc.text(lines, 15, 15)
        
        // Save PDF
        doc.save('extracted-text.pdf')
      }

      setNotification(`Text downloaded as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error downloading text:', error)
      setError('Failed to download text. Please try again.')
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    try {
      setError(null)
      setUploading(true)
      setUploadProgress(0)

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`

      const { data: storageData, error: storageError } = await supabase.storage
        .from('assigmentfile')
        .upload(fileName, selectedFile, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100
            setUploadProgress(percent)
          }
        })

      if (storageError) throw storageError

      const { data, error: dbError } = await supabase
        .from('assignments')
        .insert([
          {
            user_id: user.id,
            name: selectedFile.name,
            filename: fileName,
            size: selectedFile.size,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (dbError) {
        await supabase.storage
          .from('assigmentfile')
          .remove([fileName])
        throw dbError
      }

      // Set the file ID for comments
      setFileId(data[0].id)
      
      setNotification('File uploaded successfully!')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Error uploading file:', error.message)
      setError('Error uploading file. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div style={{
      minHeight: '10vh',
      background: '#141517',
      color: '#ffffff',
    }}>
      <Navbar />
      <div style={{
        padding: '0.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: '64px',
        background: '#1a1b1e',
        height: 'calc(100vh - 64px)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}>
        {notification && (
          <div style={{
            background: 'rgba(40, 167, 69, 0.2)',
            color: '#2ecc71',
            padding: '0.375rem',
            borderRadius: '4px',
            marginBottom: '0.375rem',
            border: '1px solid rgba(46, 204, 113, 0.2)',
            fontSize: '0.95rem',
          }}>
            {notification}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 300px',
          gap: '0.75rem',
          height: '80%',
        }}>
          {/* Upload Section */}
          <div style={{
            background: '#25262b',
            padding: '0.75rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            border: '1px solid #2c2d32',
            overflowY: 'hidden',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#1a1b1e',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#363940',
              borderRadius: '2px',
              '&:hover': {
                background: '#4a4b50',
              },
            },
          }}>
            <h1 style={{
              marginBottom: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#ffffff',
            }}>
              Upload File
            </h1>

            {enableOCR && (
              <div style={{
                marginBottom: '0.75rem',
                padding: '0.5rem',
                background: '#2c2d32',
                borderRadius: '4px',
                border: '1px solid #363940',
              }}>
                <h3 style={{ 
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#ffffff',
                }}>OCR Settings</h3>
                
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '0.25rem',
                    color: '#e0e0e0',
                    fontSize: '0.95rem',
                  }}>
                    Language:
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      border: '1px solid #363940',
                      background: '#1a1b1e',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                    }}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '0.25rem',
                    color: '#e0e0e0',
                    fontSize: '0.95rem',
                  }}>
                    Image Preprocessing:
                  </label>
                  <div style={{ 
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}>
                    {Object.entries(imagePreprocessing).map(([key, value]) => (
                      <label
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: '#e0e0e0',
                          fontSize: '0.95rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setImagePreprocessing(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                        />
                        <span>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{
              marginBottom: '0.5rem',
            }}>
              <label
                htmlFor="enableOCR"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: '#e0e0e0',
                  fontSize: '0.95rem',
                }}
              >
                <input
                  type="checkbox"
                  id="enableOCR"
                  checked={enableOCR}
                  onChange={(e) => setEnableOCR(e.target.checked)}
                />
                Enable Text Extraction (OCR)
              </label>
            </div>

            <div
              style={{
                border: '2px dashed #363940',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#2c2d32',
                transition: 'all 0.3s ease',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#0d6efd';
                e.currentTarget.style.background = '#363940';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#363940';
                e.currentTarget.style.background = '#2c2d32';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#363940';
                e.currentTarget.style.background = '#2c2d32';
                const file = e.dataTransfer.files[0];
                if (file) {
                  fileInputRef.current.files = e.dataTransfer.files;
                  handleFileSelect({ target: { files: [file] } });
                }
              }}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                ref={fileInputRef}
                accept={enableOCR ? 'image/*' : '*'}
                style={{ display: 'none' }}
              />
              <div style={{
                marginBottom: '0.25rem',
                color: '#e0e0e0',
                fontSize: '0.95rem',
              }}>
                {selectedFile ? selectedFile.name : 'Drag & drop your file here or click to browse'}
              </div>
              <div style={{
                fontSize: '0.625rem',
                color: '#909296',
              }}>
                {enableOCR ? 'Supported formats: Images (JPG, PNG, etc.)' : 'Maximum file size: 100MB'}
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(220, 53, 69, 0.2)',
                color: '#ff6b6b',
                padding: '0.375rem',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                fontSize: '0.625rem',
                border: '1px solid rgba(220, 53, 69, 0.2)',
              }}>
                {error}
              </div>
            )}

            {(uploadProgress > 0 || ocrProgress > 0) && (
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{
                  height: '2px',
                  background: '#363940',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(uploadProgress, ocrProgress)}%`,
                    background: '#0d6efd',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <div style={{
                  fontSize: '0.625rem',
                  color: '#909296',
                  marginTop: '0.25rem',
                }}>
                  {uploadProgress > 0 ? 'Uploading...' : 'Processing...'} {Math.round(Math.max(uploadProgress, ocrProgress))}%
                </div>
              </div>
            )}

            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || uploading || isExtracting}
              style={{
                background: !selectedFile || uploading || isExtracting ? '#363940' : '#0d6efd',
                color: '#ffffff',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                cursor: !selectedFile || uploading || isExtracting ? 'not-allowed' : 'pointer',
                opacity: !selectedFile || uploading || isExtracting ? 0.5 : 1,
                fontSize: '0.95rem',
              }}
            >
              {uploading ? 'Uploading...' : isExtracting ? 'Extracting Text...' : 'Upload File'}
            </button>
          </div>

          {/* Extracted Text Section */}
          <div style={{
            background: '#25262b',
            padding: '0.75rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            border: '1px solid #2c2d32',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#ffffff',
                margin: 0,
              }}>
                Extracted Text
              </h2>
              {extractedText && (
                <div style={{
                  display: 'flex',
                  gap: '0.375rem',
                  alignItems: 'center',
                }}>
                  <select
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                    style={{
                      padding: '0.25rem',
                      borderRadius: '4px',
                      border: '1px solid #363940',
                      background: '#1a1b1e',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                    }}
                  >
                    <option value="txt">TXT</option>
                    <option value="pdf">PDF</option>
                  </select>
                  <button
                    onClick={() => downloadText(downloadFormat)}
                    style={{
                      background: '#2ecc71',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                    }}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>

            <div style={{
              flex: 1,
              padding: '0.5rem',
              background: '#1a1b1e',
              borderRadius: '4px',
              border: '1px solid #363940',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              fontSize: '0.95rem',
              lineHeight: '1.3',
              color: '#e0e0e0',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#1a1b1e',
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#363940',
                borderRadius: '2px',
                '&:hover': {
                  background: '#4a4b50',
                },
              },
            }}>
              {extractedText || (
                <div style={{
                  color: '#909296',
                  textAlign: 'center',
                  padding: '1rem',
                  fontSize: '0.95rem',
                }}>
                  Upload an image and enable OCR to extract text
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div style={{
            background: '#25262b',
            padding: '0.75rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            border: '1px solid #2c2d32',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '0.75rem',
            }}>
              Comments
            </h2>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '0.75rem',
            }}>
              {comments.map((comment, index) => (
                <div
                  key={index}
                  style={{
                    background: '#2c2d32',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#909296',
                    marginBottom: '0.25rem',
                  }}>
                    {comment.user_email}
                  </div>
                  <div style={{
                    color: '#e0e0e0',
                    fontSize: '0.875rem',
                  }}>
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
            }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #363940',
                  background: '#1a1b1e',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addComment()
                  }
                }}
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                style={{
                  background: !newComment.trim() ? '#363940' : '#0d6efd',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  cursor: !newComment.trim() ? 'not-allowed' : 'pointer',
                  opacity: !newComment.trim() ? 0.5 : 1,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home