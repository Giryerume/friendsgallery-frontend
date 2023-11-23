import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import ApprovePhotosButton from '../components/ApprovePhotosButton'
import UploadPhotoButton from '../components/UploadPhotoButton'


const HomePage = () => {
    let [photos, setPhotos] = useState([])
    let { user, authTokens, logoutUser } = useContext(AuthContext)

    let getPhotos = async () => {
        let response = await fetch(
            'http://127.0.0.1:8000/api/approved_photos/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },

            })
        let data = await response.json()

        if (response.status === 200) {
            setPhotos(data)
        } else if (response.status === 401) {
            logoutUser()
        }
    }

    useEffect(() => {
        getPhotos()
        const intervalId = setInterval(getPhotos, 30000);
        return () => clearInterval(intervalId);
    }, [])


    const userLikes = (photo) => {
        return photo.likes.filter(like => like.user === user.username)
    }

    const likePhoto = async (photoId) => {
        const body = new FormData()
        body.append('photo', String(photoId))
        let response = await fetch(
            "http://127.0.0.1:8000/api/likes/",
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: body
            }
        )
        if (response.status === 201) {
            getPhotos()
        } else {
            alert('Something went wrong!')
        }
    }

    const dislikePhoto = async (likeId) => {
        console.log(likeId)
        let response = await fetch(
            'http://127.0.0.1:8000/api/likes/' + String(likeId) + "/",
            {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
            })
        if (response.status === 204) {
            getPhotos()
        } else {
            alert('Something went wrong!')
        }
    }

    const submitComment = async (e) => {
        e.preventDefault()

        let response = await fetch(
            "http://127.0.0.1:8000/api/comments/",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({
                    'photo': e.target.photo.value,
                    'content': e.target.content.value
                })
            }
        )
        if (response.status === 201) {
            getPhotos()
        } else {
            alert('Something went wrong!')
        }
    }

    const removeComment = async (commentId) => {
        let response = await fetch(
            'http://127.0.0.1:8000/api/comments/' + String(commentId) + "/",
            {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
            })
        if (response.status === 204) {
            getPhotos()
        } else {
            alert('Something went wrong!')
        }
    }

    return (
        <div>
            <h1>Friend's Gallery</h1>
            {user.is_superuser ? <ApprovePhotosButton /> : <UploadPhotoButton />}
            <ul>
                {photos.map(photo => (
                    <li key={photo.id}>
                        <div>
                            <h3>{photo.user}: {photo.title}</h3>
                            <h5>{photo.comment}</h5>
                            <img src={photo.image} alt={photo.title} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                            <p>{photo.likes.length} likes</p>
                            <div>
                                {photo.comments && photo.comments.map(comment => (
                                    <li key={comment.id}>
                                        <div>
                                            <p>{comment.commented_by}: {comment.content}</p>
                                            {
                                                comment.commented_by === user.username &&
                                                <button onClick={() => removeComment(comment.id)}>X</button>
                                            }
                                        </div>
                                    </li>
                                ))}
                            </div>
                            <div>
                                <form onSubmit={submitComment}>
                                    <input type='text' name='content' placeholder='Comment' />
                                    <input type="hidden" name="photo" value={photo.id} />
                                    <input type='submit' />
                                </form>
                                {
                                    userLikes(photo).length === 0 ?
                                        <button onClick={() => likePhoto(photo.id)}>Like</button> :
                                        <button onClick={() => dislikePhoto(userLikes(photo)[0].id)}>Liked</button>
                                }
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default HomePage