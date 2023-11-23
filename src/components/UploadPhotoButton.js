import React from 'react'
import { Link } from 'react-router-dom'

const UploadPhotoButton = () => {
  return (
    <Link to='/upload'>
        <button>You Want to Upload a Photo?</button>
    </Link>
  )
}

export default UploadPhotoButton