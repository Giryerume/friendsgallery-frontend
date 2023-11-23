import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext


export const AuthProvider = ({ children }) => {

    let tokens = localStorage.getItem('authTokens')
    let [authTokens, setAuthTokens] = useState(() => tokens ? JSON.parse(tokens) : null)
    let [user, setUser] = useState(() => tokens ? jwtDecode(tokens) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let createUser = async (e) => {
        e.preventDefault()

        let response = await fetch(
            "http://127.0.0.1:8000/api/users/",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': e.target.username.value,
                    'email': e.target.email.value,
                    'password': e.target.password.value
                })
            }
        )
        if (response.status === 201) {
            navigate('/login')
        } else {
            alert('Something went wrong!')
        }
    }

    let loginUser = async (e) => {
        e.preventDefault()

        let response = await fetch(
            "http://127.0.0.1:8000/api/token/",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'username': e.target.username.value,
                    'password': e.target.password.value
                })
            }
        )
        let data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/')
        } else {
            alert('Something went wrong!')
        }

    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let updateToken = async () => {

        if (authTokens) {
            let response = await fetch(
                "http://127.0.0.1:8000/api/token/refresh/",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        'refresh': authTokens.refresh,
                    })
                }
            )
            let data = await response.json()
            if (response.status === 200) {
                console.log('Token updated!')
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
                // navigate('/')
            } else {
                logoutUser()
            }
        }

        if (loading) {
            setLoading(false)
        }

    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        createUser: createUser,
    }

    useEffect(
        () => {
            if (loading) {
                updateToken()
            }

            let fourMinutes = 1000 * 60 * 4
            let interval = setInterval(
                () => {
                    if (authTokens) {
                        updateToken()
                    }
                },
                fourMinutes
            )
            return () => clearInterval(interval)
        },
        [authTokens, loading]
    )

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}