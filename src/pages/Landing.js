import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Footer from '../components/Footer'

// Add Tektur font import
const TekturFont = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Tektur:wght@400;500;600;700;800;900&display=swap');
      
      @keyframes blink {
        0% { opacity: 0.05; }
        50% { opacity: 0.2; }
        100% { opacity: 0.05; }
      }

      .particle {
        position: absolute;
        background: linear-gradient(45deg, rgba(0, 255, 135, 0.1), rgba(96, 239, 255, 0.1));
        border-radius: 50%;
        pointer-events: none;
        filter: blur(3px);
      }

      .particle::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(96, 239, 255, 0.08) 0%, transparent 70%);
        transform: translate(-50%, -50%);
      }

      .particle-1 { animation: blink 4s infinite ease-in-out; }
      .particle-2 { animation: blink 6s infinite ease-in-out; }
      .particle-3 { animation: blink 5s infinite ease-in-out; }
    `}
  </style>
)

function Landing() {
  const [isVisible, setIsVisible] = useState(false)
  const [user, setUser] = useState(null)
  const [text, setText] = useState('')
  const fullText = 'Document Management\nReimagined'
  const [showCursor, setShowCursor] = useState(true)
  const [visibleSections, setVisibleSections] = useState([])

  useEffect(() => {
    setIsVisible(true)
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Typing effect
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => [...new Set([...prev, entry.target.id])])
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    document.querySelectorAll('.scroll-section').forEach((section) => {
      observer.observe(section)
    })

    return () => {
      subscription.unsubscribe()
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
      observer.disconnect()
    }
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  return (
    <>
      <TekturFont />
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        position: 'relative',
      }}>
        {/* Main content container */}
        <div style={{
          position: 'relative',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Header */}
          <nav style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.5s ease',
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #00ff87, #60efff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              DocuScan
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
            }}>
              <Link
                to="/login"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  color: 'black',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(45deg, #00ff87, #60efff)',
                  boxShadow: '0 4px 15px rgba(0, 255, 135, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 135, 0.4)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 135, 0.3)'
                }}
              >
                Sign Up
              </Link>
            </div>
          </nav>

          {/* Hero section */}
          <div
            id="hero"
            className="scroll-section"
            style={{
              textAlign: 'center',
              opacity: visibleSections.includes('hero') ? 1 : 0,
              transform: visibleSections.includes('hero') ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 0.6s ease-out',
            }}
          >
            <h1 style={{
              fontSize: '4rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              background: 'linear-gradient(45deg, #ffffff, #60efff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Tektur, sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              whiteSpace: 'pre-line',
              position: 'relative',
              display: 'inline-block'
            }}>
              {text}
              <span style={{
                opacity: showCursor ? 1 : 0,
                transition: 'opacity 0.1s',
                WebkitTextFillColor: '#60efff',
                marginLeft: '5px'
              }}>|</span>
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '2.5rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}>
              Upload, manage, and track your Documents with ease. Advanced OCR technology to extract text from images instantly.
            </p>
            <Link
              to="/signup"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                fontSize: '1.25rem',
                fontWeight: '500',
                borderRadius: '12px',
                color: 'black',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(45deg, #00ff87, #60efff)',
                boxShadow: '0 4px 15px rgba(0, 255, 135, 0.3)',
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)'
                e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 135, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)'
                e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 135, 0.3)'
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Features Section */}
          <div
            id="features"
            className="scroll-section"
            style={{
              marginTop: '6rem',
              width: '100%',
              opacity: visibleSections.includes('features') ? 1 : 0,
              transform: visibleSections.includes('features') ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 0.6s ease-out',
            }}
          >
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '3rem',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #ffffff, #60efff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Tektur, sans-serif',
            }}>
              Powerful Features
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              padding: '0 1rem',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
              }}
              onMouseOver={(e) => {
                if (e.target === e.currentTarget) {
                  e.target.style.border = '1px solid #00ff87';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 255, 135, 0.3)';
                  e.target.style.transform = 'translateY(-5px)';
                }
              }}
              onMouseOut={(e) => {
                if (e.target === e.currentTarget) {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#00ff87',
                }}>Advanced OCR</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Extract text from any image or document instantly with our cutting-edge OCR technology.
                </p>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
              }}
              onMouseOver={(e) => {
                if (e.target === e.currentTarget) {
                  e.target.style.border = '1px solid #00ff87';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 255, 135, 0.3)';
                  e.target.style.transform = 'translateY(-5px)';
                }
              }}
              onMouseOut={(e) => {
                if (e.target === e.currentTarget) {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#00ff87',
                }}>Smart Organization</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Automatically categorize and organize your documents with AI-powered classification.
                </p>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
              }}
              onMouseOver={(e) => {
                if (e.target === e.currentTarget) {
                  e.target.style.border = '1px solid #00ff87';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 255, 135, 0.3)';
                  e.target.style.transform = 'translateY(-5px)';
                }
              }}
              onMouseOut={(e) => {
                if (e.target === e.currentTarget) {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#00ff87',
                }}>Secure Storage</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Your documents are encrypted and stored securely in the cloud with enterprise-grade security.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div
            id="how-it-works"
            className="scroll-section"
            style={{
              marginTop: '6rem',
              width: '100%',
              opacity: visibleSections.includes('how-it-works') ? 1 : 0,
              transform: visibleSections.includes('how-it-works') ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 0.6s ease-out',
            }}
          >
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '3rem',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #ffffff, #60efff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Tektur, sans-serif',
            }}>
              How It Works
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(45deg, #00ff87, #60efff)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}>1</div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Upload Your Documents</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Simply drag and drop your documents or use our upload button to get started.
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(45deg, #00ff87, #60efff)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}>2</div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Automatic Processing</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Our AI automatically processes your documents, extracts text, and organizes them.
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(45deg, #00ff87, #60efff)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}>3</div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Access & Manage</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Access your processed documents anytime, anywhere, and manage them with ease.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Landing 