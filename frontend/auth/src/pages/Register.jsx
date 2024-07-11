import { useEffect, useState } from 'react'

import { useNavigate } from "react-router-dom"

import {useAuth} from "../context/AuthContext"

import styles from "./Register.module.css"

import {FaEye, FaEyeSlash} from 'react-icons/fa'

const Register = () => {

    const {isAuthenticated} = useAuth()

    const [eyeValue, setEyeValue] = useState(true)

    const handleEye = () => {

        setEyeValue(eyeValue => !eyeValue)

    }

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    useEffect(() => {

        {isAuthenticated && navigate("/")}

    }, [isAuthenticated])

    const handleForm = async(e) => {

        e.preventDefault()

        if(!name || !email) {
            setError("Por favor preencha o formulário!")
            return
        }
        if(password !== confirmPassword) {
            setError("As senhas precisam ser iguais!")
            return
        }

        const data = {
            name,
            email,
            password,
            confirmPassword
        }

        const url = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        })

        const res = await url.json()

        if(res.error) {
            return setError(res.error)
        }

        navigate("/login")

    }

  return (
    <div className={styles.register}>

    <h2> Welcome to the register's page </h2>

        <form onSubmit={handleForm}>

            <input type="text"
            placeholder='Your name here!'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <input type="email"
            placeholder='Your email here!'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <label>

                <input type={eyeValue == true ? 'password' : 'text'}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button type="button" className={styles.buttonEye} onClick={handleEye}> {eyeValue == false ? <FaEye/> : <FaEyeSlash/> } </button>
            
            </label>

            <label>

                <input type={eyeValue == true ? 'password' : 'text'}
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button type="button" className={styles.buttonEye} onClick={handleEye}> {eyeValue == false ? <FaEye/> : <FaEyeSlash/> } </button>

            </label>

            {error && <p className={styles.error}> {error} </p>}

            <button className={styles.submitButton} type='submit'> Register </button>
            
        </form>

    </div>
  )
}

export default Register