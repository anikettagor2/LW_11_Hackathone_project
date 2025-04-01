import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { jsPDF as JsPDF } from 'jspdf'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Manage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUserFiles()
  }, [])

  const fetchUserFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('User error:', userError)
        throw new Error('Authentication error. Please log in again.')
      }

      if (!user) {
        throw new Error('No user found. Please log in.')
      }

      console.log('Fetching files for user:', user.id)

      // First, check if we can access the table at all
      const { data: testData, error: testError } = await supabase
        .from('assignments')
        .select('count')
        .limit(1)

      if (testError) {
        console.error('Table access error:', testError)
        throw new Error('Cannot access the assignments table. Please check database permissions.')
      }

      // Now fetch the actual files
      const { data, error: fetchError } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Database fetch error details:', {
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          code: fetchError.code
        })
        throw new Error(`Database error: ${fetchError.message}`)
      }

      console.log('Fetched files:', data)
      setFiles(data || [])
    } catch (error) {
      console.error('Error in fetchUserFiles:', error)
      setError(error.message || 'Failed to load files. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fileId, filename) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('assigmentfile')
        .remove([filename])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('assignments')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      // Update local state
      setFiles(files.filter(file => file.id !== fileId))
      setNotification('File deleted successfully!')
    } catch (error) {
      console.error('Error deleting file:', error)
      setError('Failed to delete file. Please try again.')
    }
  }

  const downloadFile = async (file) => {
    try {
      if (file.extracted_text) {
        // If it's a text file (has extracted text), download as text
        const blob = new Blob([file.extracted_text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${file.name || file.filename}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        // Download original file
        const { data, error } = await supabase.storage
          .from('assigmentfile')
          .download(file.filename)

        if (error) throw error

        const url = URL.createObjectURL(data)
        const link = document.createElement('a')
        link.href = url
        link.download = file.name || file.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      setError('Failed to download file. Please try again.')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date available'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter files based on search query
  const filteredFiles = files.filter(file => 
    (file.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (file.filename?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: 'calc(100vh - 128px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          marginTop: '64px',
          marginBottom: '64px'
        }}>
          <div style={{
            color: '#6c757d',
            fontSize: '1.2rem'
          }}>
            Loading your files...
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: 'calc(100vh - 128px)',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        marginTop: '64px',
        marginBottom: '64px'
      }}>
        {notification && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}>
            {notification}
          </div>
        )}

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              color: '#2d3436',
              fontSize: '2rem',
              fontWeight: '700',
              margin: 0
            }}>
              Manage Your Files
            </h1>

            <div style={{
              position: 'relative',
              width: '300px'
            }}>
              <input
                type="text"
                placeholder="Search files by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingLeft: '2.5rem',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1rem',
                  height: '1rem',
                  color: '#6c757d'
                }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {files.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              No files uploaded yet. Go to the home page to upload files.
            </div>
          ) : filteredFiles.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              No files match your search.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredFiles.map((file) => (
                <div key={file.id} style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      color: '#2d3436',
                      margin: 0,
                      fontSize: '1.1rem',
                      wordBreak: 'break-word'
                    }}>
                      {file.filename || file.name}
                    </h3>
                    <button
                      onClick={() => handleDelete(file.id, file.filename)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <div style={{
                    color: '#6c757d',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                  }}>
                    <div>Size: {formatFileSize(file.size)}</div>
                    <div>Name: {file.name}</div>
                    <div>Uploaded: {formatDate(file.created_at)}</div>
                  </div>

                  {file.extracted_text && (
                    <div style={{
                      marginBottom: '1rem',
                      padding: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      maxHeight: '100px',
                      overflowY: 'auto'
                    }}>
                      <div style={{
                        color: '#2d3436',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem'
                      }}>
                        Extracted Text Preview:
                      </div>
                      <div style={{
                        color: '#6c757d',
                        fontSize: '0.75rem',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {file.extracted_text?.substring(0, 200)}...
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => downloadFile(file)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Manage 