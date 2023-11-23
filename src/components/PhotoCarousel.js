import React, { useState, useEffect, useContext } from 'react'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import AuthContext from '../context/AuthContext'

const PhotoCarousel = () => {
    const [photos, setPhotos] = useState([])
    const { authTokens } = useContext(AuthContext)

    const fetchData = async () => {
        try {
            const response = await fetch(
                'http://127.0.0.1:8000/api/photos/',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + String(authTokens.access)
                    },

                })
            const data = await response.json();
            setPhotos(data)
        } catch (error) {
            console.error('Erro na requisição:', error)
        }
    }

    const approvePhoto = async (photoId) => {
        const body = new FormData()
        body.append('photo', String(photoId))
        try {
            const response = await fetch(
                'http://127.0.0.1:8000/api/approve/',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + String(authTokens.access)
                    },
                    body: body
                })
        } catch (error) {
            console.error('Erro na requisição:', error)
        }
    }

    const disapprovePhoto = async (photoId) => {
        try {
            const response = await fetch(
                'http://127.0.0.1:8000/api/approve/' + String(photoId) + "/",
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + String(authTokens.access)
                    },
                })
        } catch (error) {
            console.error('Erro na requisição:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    const handleApproveButton = (photoId) => {
        console.log('Approved! ' + String(photoId))
        approvePhoto(photoId)
        fetchData()
    }

    const handleDisapproveButton = (approveId) => {
        console.log('Disapproved! ' + String(approveId))
        disapprovePhoto(approveId)
        fetchData()
    }

    return (
        <div>
            <Slider {...settings}>
                {photos.map((photo, index) => (
                    <div key={index}>
                        <h1>{photo.title}</h1>
                        <h4>{photo.comment}</h4>
                        <img src={photo.image} alt={photo.comment} style={{ maxWidth: '100%', maxHeight: '200px', margin: 'auto' }} />
                        <button onClick={() => handleDisapproveButton(photo.approve[0].id)} disabled={photo.approve.length === 0}>Not this One</button>
                        <button onClick={() => handleApproveButton(photo.id)} disabled={photo.approve.length !== 0}>Approve this Photo</button>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default PhotoCarousel