import { useEffect } from "react"

import { NavLink } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

import styles from "./Navbar.module.css"

const Navbar = () => {


  const {isLoggedIn, logout, isAuthenticated} = useAuth()

  useEffect(() => {
    isLoggedIn()
  },[])

  return (
    <div>

        <nav className={styles.navbar}>

          <div>
            <NavLink to="/" className={({isActive}) => (isActive ? styles.active : '')}> Home </NavLink>
          </div>

          <div>
            {!isAuthenticated && <NavLink to="/login" className={({isActive}) => (isActive ? styles.active : '')}> Login </NavLink>}
            {!isAuthenticated && <NavLink to="/register" className={({isActive}) => (isActive ? styles.active : '')}> Register </NavLink>}
            {isAuthenticated && <NavLink to="/perfil" className={({isActive}) => (isActive ? styles.active : '')}> Perfil </NavLink>}
            {isAuthenticated && <button onClick={logout}> Logout </button> }
          </div>

        </nav>

    </div>
  )
}

export default Navbar