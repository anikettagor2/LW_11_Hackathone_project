import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <>
      {/* Add Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <footer style={{
        position: 'relative',
        padding: '2rem',
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        overflow: 'hidden',
        zIndex: 10,
        marginTop: '4rem',
        width: '100%',
        borderRadius: '24px',
      }}>
        {/* Animated gradient line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '24px',
          right: '24px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00ff87, #60efff, transparent)',
          animation: 'gradientLine 3s linear infinite',
          borderRadius: '2px',
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          position: 'relative',
          zIndex: 20,
        }}>
          {/* Brand section */}
          <div>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              background: 'linear-gradient(45deg, #00ff87, #60efff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              DocuScan
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '300px',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
            }}>
              Transform your document management experience with our cutting-edge OCR technology.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
            }}>
              {[
                {
                  name: 'github',
                  url: 'https://github.com/AniketTagor',
                  icon: 'fab fa-github'
                },
                {
                  name: 'linkedin',
                  url: 'https://www.linkedin.com/in/aniket-tagor-25932b246/',
                  icon: 'fab fa-linkedin'
                },
                {
                  name: 'twitter',
                  url: 'https://x.com/AniketTagor',
                  icon: 'fab fa-x-twitter'
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '50%',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)'
                    e.target.style.background = 'linear-gradient(45deg, rgba(0, 255, 135, 0.2), rgba(96, 239, 255, 0.2))'
                    e.target.style.borderColor = '#00ff87'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <i className={social.icon} style={{ fontSize: '1.1rem' }}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: '#00ff87',
              fontWeight: '600',
            }}>
              Quick Links
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: '0.5rem',
            }}>
              {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = '#00ff87'
                      e.target.style.transform = 'translateX(5px)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = 'rgba(255, 255, 255, 0.7)'
                      e.target.style.transform = 'translateX(0)'
                    }}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: '#00ff87',
              fontWeight: '600',
            }}>
              Contact Us
            </h3>
            <form style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label
                  htmlFor="name"
                  style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    width: '100%',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00ff87'
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 255, 135, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    width: '100%',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00ff87'
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 255, 135, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label
                  htmlFor="message"
                  style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your message"
                  rows={3}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    width: '100%',
                    resize: 'vertical',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00ff87'
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 255, 135, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(45deg, #00ff87, #60efff)',
                  color: 'black',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
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
                Send Message
              </button>
            </form>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: '#00ff87',
              fontWeight: '600',
            }}>
              Newsletter
            </h3>
            <form style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label
                  htmlFor="newsletter-email"
                  style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Subscribe to our newsletter for updates and exclusive offers.
                </label>
                <input
                  type="email"
                  id="newsletter-email"
                  placeholder="Enter your email"
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    width: '100%',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00ff87'
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 255, 135, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(45deg, #00ff87, #60efff)',
                  color: 'black',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
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
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright section */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.85rem',
          position: 'relative',
          zIndex: 20,
        }}>
          <p style={{ marginBottom: '1rem' }}>© {new Date().getFullYear()} DocuScan. All rights reserved.</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <Link to="/privacy" style={{ 
              color: 'rgba(255, 255, 255, 0.5)', 
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#00ff87'
            }}
            onMouseOut={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.5)'
            }}
            >
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ 
              color: 'rgba(255, 255, 255, 0.5)', 
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#00ff87'
            }}
            onMouseOut={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.5)'
            }}
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Add custom styles for animations */}
        <style>
          {`
            @keyframes gradientLine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}
        </style>
      </footer>
    </>
  )
}

export default Footer 