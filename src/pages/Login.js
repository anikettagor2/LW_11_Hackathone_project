import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/Auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, setUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Authenticate with Supabase
      const { error } = await signIn(email, password)
      if (error) throw error

      navigate('/upload') // Redirect to upload page
    } catch (error) {
      console.error('Login error:', error.message)
      setError('Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      setLoading(true)
      const { error } = await signInWithGoogle()
      if (error) throw error
      
      // Set as non-admin user for Google sign-in
      localStorage.setItem('isAdmin', 'false')
      navigate('/upload')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#2d3436',
          marginBottom: '1.5rem',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Login
        </h1>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fff5f5',
            color: '#c53030',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2d3436',
              fontWeight: '500'
            }}>
              
            </label>
            <input
              id="email"
              type="email"
              placeholder=" Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2d3436',
              fontWeight: '500'
            }}>
            </label>
            <input
              id="password"
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          margin: '1.5rem 0',
          display: 'flex', 
          alignItems: 'center', 
          textAlign: 'center'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#dee2e6' }}></div>
          <span style={{ padding: '0 1rem', color: '#6c757d' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#dee2e6' }}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: 'white',
            color: '#2d3436',
            border: '1px solid #dee2e6',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            style={{ width: '20px', height: '20px' }}
          />
          Continue with Google
        </button>

        <p style={{
          marginTop: '1.5rem',
          color: '#6c757d'
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login 