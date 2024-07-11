import { useState, useEffect } from "react"

import { useAuth } from "../context/AuthContext"

import { useNavigate } from "react-router-dom"

import styles from "./Perfil.module.css"

const Perfil = () => {

    const {isAuthenticated} = useAuth()

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [profilePic, setProfilePic] = useState("")

    useEffect(() => {
        
        if(localStorage.getItem('userEmail')) {
            setEmail(localStorage.getItem('userEmail'))
        } else {
            {!isAuthenticated && navigate('/')}
        }

    }, [isAuthenticated])


    /* GET USER */
    useEffect(() => {

        const getUser = async() => {

            if(!email) return

            const response = await fetch("http://localhost:3000/auth/perfil", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({email})
            })

            const res = await response.json()

            setProfilePic(res.profilePic)
            setName(res.name)

        }

        getUser()

    }, [email])

    /* HANDLE EDIT */
    const handleEdit = async() => {

        const userDataToUpdate = {name, email, profilePic}

        const response = await fetch("http://localhost:3000/auth/att", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(userDataToUpdate)
        })

        const res = await response.json()

        console.log(res)

    }

  return (
    <div>

        <div className={styles.perfil}>

            <div className={styles.profilePic} style={{backgroundImage: `url('${profilePic}')`}}/>
            
            <form onSubmit={handleEdit}>
                
                <label>

                    <p>Nome</p>

                    <input type="text"
                    placeholder="User name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    />

                </label>

                <label>

                    <p>Email</p>

                    <input type="email"
                    placeholder="User email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled
                    />

                </label>
                
                <label>

                    <p>Profile picture URL</p>

                    <input type="text"
                    placeholder="Profile picture url"
                    onChange={(e) => setProfilePic(e.target.value)}
                    value={profilePic}
                    />

                </label>
                
                <button type="submit"> Change info </button>
                
            </form>


        </div>

    </div>
  )
}

export default Perfil