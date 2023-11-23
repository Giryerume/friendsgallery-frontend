import React from 'react'
import { Link } from 'react-router-dom'

const ApprovePhotosButton = () => {
  return (
    <Link to='/approve'>
        <button>Let's Check Your Friends Photos?</button>
    </Link>
  )
}

export default ApprovePhotosButton