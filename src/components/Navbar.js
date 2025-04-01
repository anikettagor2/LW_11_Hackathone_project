import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Navbar() {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Only show navbar if user is logged in or not on landing page
  if (!user && location.pathname === '/') return null

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1rem 2rem',
        backdropFilter: 'blur(10px)',
        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.7)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        transform: `translateY(${scrolled ? 0 : '0'})`,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Link to="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #00ff87, #60efff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}>
            DocuScan
          </Link>

          {user && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}>
              <Link
                to="/manage"
                style={{
                  padding: '0.5rem 1rem',
                  color: location.pathname === '/manage' ? '#60efff' : 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#60efff'
                }}
                onMouseOut={(e) => {
                  e.target.style.color = location.pathname === '/manage' ? '#60efff' : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '50%',
                  width: location.pathname === '/manage' ? '100%' : '0',
                  height: '2px',
                  background: 'linear-gradient(45deg, #00ff87, #60efff)',
                  transition: 'all 0.3s ease',
                  transform: 'translateX(-50%)',
                }} />
                Manage Files
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #ff4757',
                  color: '#ff4757',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.875rem',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#ff4757'
                  e.target.style.color = 'white'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#ff4757'
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
      {/* Only add spacer if navbar is shown */}
      {(!user && location.pathname === '/') ? null : <div style={{ height: '64px' }} />}
    </>
  )
}

export default Navbar 