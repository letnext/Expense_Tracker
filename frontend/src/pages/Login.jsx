import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // ✅ navigation hook
import bgImage from '../assets/login_bgc.png'
import '../styles/login.css' 

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (username === '1234' && password === '1234') {
      navigate('/dashboard') 
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div 
      className="login-page"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
