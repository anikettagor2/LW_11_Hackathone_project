import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

function Features() {
  const [visibleSections, setVisibleSections] = useState([])

  useEffect(() => {
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

    document.querySelectorAll('.feature-section').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      id: 'ocr',
      title: 'Advanced OCR Technology',
      description: 'Our cutting-edge OCR technology can extract text from any image or document with high accuracy. Support for multiple languages and complex layouts.',
      icon: 'fas fa-file-alt',
      details: [
        'Multi-language support',
        'Complex layout recognition',
        'Handwriting recognition',
        'Real-time processing',
        'Batch processing capability'
      ]
    },
    {
      id: 'organization',
      title: 'Smart Document Organization',
      description: 'Automatically categorize and organize your documents using AI-powered classification. Never lose track of your important files again.',
      icon: 'fas fa-folder-tree',
      details: [
        'AI-powered categorization',
        'Custom organization rules',
        'Smart search functionality',
        'Tag-based organization',
        'Folder hierarchy support'
      ]
    },
    {
      id: 'security',
      title: 'Enterprise-Grade Security',
      description: 'Your documents are protected with state-of-the-art encryption and security measures. Access control and audit logs for complete transparency.',
      icon: 'fas fa-shield-alt',
      details: [
        'End-to-end encryption',
        'Role-based access control',
        'Audit logging',
        'Secure file sharing',
        'Compliance management'
      ]
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team members. Share documents, add comments, and track changes in real-time.',
      icon: 'fas fa-users',
      details: [
        'Real-time collaboration',
        'Document sharing',
        'Comment system',
        'Version control',
        'Team workspaces'
      ]
    },
    {
      id: 'analytics',
      title: 'Document Analytics',
      description: 'Get insights into your document usage patterns and optimize your workflow with detailed analytics.',
      icon: 'fas fa-chart-bar',
      details: [
        'Usage statistics',
        'Document insights',
        'Workflow optimization',
        'Custom reports',
        'Performance metrics'
      ]
    },
    {
      id: 'integration',
      title: 'Third-Party Integration',
      description: 'Connect with your favorite tools and services. Seamless integration with popular platforms and applications.',
      icon: 'fas fa-plug',
      details: [
        'Cloud storage integration',
        'Email integration',
        'API access',
        'Webhook support',
        'Custom integrations'
      ]
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      position: 'relative',
    }}>
      {/* Header */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <Link to="/" style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #00ff87, #60efff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none',
        }}>
          DocuScan
        </Link>
        <div style={{
          display: 'flex',
          gap: '1rem',
        }}>
          <Link to="/" style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}>
            Home
          </Link>
          <Link to="/signup" style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            color: 'black',
            textDecoration: 'none',
            background: 'linear-gradient(45deg, #00ff87, #60efff)',
            transition: 'all 0.3s ease',
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        padding: '8rem 2rem 4rem',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          background: 'linear-gradient(45deg, #ffffff, #60efff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Powerful Features
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: '1.6',
        }}>
          Discover how DocuScan can transform your document management experience with our comprehensive suite of features.
        </p>
      </div>

      {/* Features Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
      }}>
        {features.map((feature) => (
          <div
            key={feature.id}
            id={feature.id}
            className="feature-section"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              opacity: visibleSections.includes(feature.id) ? 1 : 0,
              transform: visibleSections.includes(feature.id) ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 0.6s ease-out',
            }}
          >
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1.5rem',
              color: '#00ff87',
            }}>
              <i className={feature.icon}></i>
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#ffffff',
            }}>
              {feature.title}
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
            }}>
              {feature.description}
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {feature.details.map((detail, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}>
                  <i className="fas fa-check" style={{ color: '#00ff87' }}></i>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        marginTop: '4rem',
        background: 'linear-gradient(45deg, rgba(0, 255, 135, 0.1), rgba(96, 239, 255, 0.1))',
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(45deg, #ffffff, #60efff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Ready to Get Started?
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem',
        }}>
          Join thousands of users who are already transforming their document management experience.
        </p>
        <Link
          to="/signup"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '12px',
            color: 'black',
            textDecoration: 'none',
            background: 'linear-gradient(45deg, #00ff87, #60efff)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 135, 0.3)'
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }}
        >
          Start Free Trial
        </Link>
      </div>

      <Footer />
    </div>
  )
}

export default Features 