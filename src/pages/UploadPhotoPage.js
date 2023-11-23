import React, { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const UploadPhotoPage = () => {
    const [previewImage, setPreviewImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setSelectedImage(file)
            
            const reader = new FileReader()

            reader.onload = () => {
                setPreviewImage(reader.result)
            }

            reader.readAsDataURL(file)
        }
    }

    let { authTokens } = useContext(AuthContext)

    let uploadPhoto = async (e) => {
        e.preventDefault()
        
        const body = new FormData()
        body.append('title', e.target.title.value)
        body.append('comment', e.target.comment.value)
        body.append('image', selectedImage)

        let response = await fetch(
            "http://127.0.0.1:8000/api/approved_photos/",
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+String(authTokens.access)
                },
                body: body
            }
        )
        if (response.status === 201) {
            alert('Your photo was sent to be approved!')
        } else {
            alert('Something went wrong!')
        }

    }

    return (
        <div>
            <form onSubmit={uploadPhoto}>
                {previewImage && (
                    <div>
                        <img
                            src={previewImage}
                            alt="Selected image"
                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                    </div>
                )}
                <input type='file' accept="image/*" name='image' onChange={handleImageChange} />
                <p>Insert a title for your photo...</p>
                <input type='text' placeholder='Insert a title' name='title' />
                <p>Insert a comment with your feelings...</p>
                <input type='text-box' placeholder='Comment here' name='comment' />
                <input type='submit' value="Send for Check!" />
            </form>
        </div>
    )
}

export default UploadPhotoPage