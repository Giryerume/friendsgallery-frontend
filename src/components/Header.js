import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    let { user, logoutUser } = useContext(AuthContext)

    return (
        <div>
            {user ? (<Link onClick={logoutUser}>Logout</Link>) : (<Link to="/login">Login</Link>)}
            <span> | </span>
            <Link to="/">Home</Link>
            <span> | </span>
            <Link to="/register">Create Account</Link>
            {user && <p>Hello, {user.username}</p>}
        </div>
    )
}

export default Header