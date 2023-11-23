import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'


const LoginPage = () => {
    let { loginUser } = useContext(AuthContext)
    return (
        <div>
            <form onSubmit={loginUser}>
                <input type='text' name='username' placeholder='Name' />
                <input type='password' name='password' placeholder='Password' />
                <input type='submit' value="Login" />
                <Link to="/register">
                    <button>Create Account</button>
                </Link>
            </form>
        </div>
    )
}

export default LoginPage