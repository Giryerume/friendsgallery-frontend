import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const CreateAccountPage = () => {
    let {createUser} = useContext(AuthContext)
    return (
        <div>
            <form onSubmit={createUser}>
                <input type='text' name='username' placeholder='Name' />
                <input type='email' name='email' placeholder='Email' />
                <input type='password' name='password' placeholder='Password' />
                <input type='submit' />
            </form>
        </div>
    )
}

export default CreateAccountPage