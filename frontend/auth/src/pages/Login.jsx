import { useEffect, useState } from "react"

import styles from "./Login.module.css"

import { useAuth } from "../context/AuthContext"

import { useNavigate } from "react-router-dom"

import {FaEye, FaEyeSlash} from 'react-icons/fa'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [toggleEye, setToggleEye] = useState(false)
  const [error, setError] = useState("")

  const {isAuthenticated, isLoggedIn} = useAuth()

  const navigate = useNavigate()

  useEffect(() => {

    {isAuthenticated && navigate("/")}

  },[isAuthenticated])

  const handleLogin = async(e) => {

    e.preventDefault()

    if(!email || !password) {
      setError("Email or Password are empty")
      return
    }

    const data = {email, password}

    try {

      const response = await fetch('http://localhost:3000/auth/login', {
        method:"POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
      })

      const res = await response.json()

      if(res.error) return setError(res.error)

      const {token, userEmail} = res

      localStorage.setItem('token', token)
      localStorage.setItem('userEmail', userEmail)

      isLoggedIn()

    } catch(error) {
      console.log('Erro ao fazer login', error.message)
    }

  }

  return (
    <div className={styles.login}>

      <h2> Welcome to login's page </h2>

      <form onSubmit={handleLogin}>

        <input type="email"
        placeholder="Type your email here!"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.inputEmail}
        />

        <div>
          <input type={toggleEye ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.passwordEye}
          />

          {toggleEye ?
          <FaEye onClick={() => setToggleEye(false)} className={styles.eye}></FaEye>
          :
          <FaEyeSlash onClick={() => setToggleEye(true)} className={styles.eye}></FaEyeSlash>
          }

        </div>
        

        {error && <p className={styles.error}> {error} </p>}

        <button type="submit"> Login </button>

      </form>

    </div>
  )
}

export default Login