import { useContext, createContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const isLoggedIn = async() => {

        const token = localStorage.getItem("token")

        if(!token) {
            return setIsAuthenticated(false)
        }

        try {

            const response = await fetch('http://localhost:3000/auth/verify', {
                method:'POST',
                headers: {
                    "authorization": `Bearer ${token}`
                }
            })

            if(response.ok) {
                console.log(response)
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }

        } catch(err) {
            console.log(err)
        }

    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userName")
        localStorage.removeItem("userEmail")
        setIsAuthenticated(false)
    }

    return (

        <AuthContext.Provider value={{isAuthenticated, isLoggedIn, logout}}>

            {children}

        </AuthContext.Provider>

    )

}


export const useAuth = () => useContext(AuthContext)