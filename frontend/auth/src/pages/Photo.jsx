import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { FaRegTrashAlt } from "react-icons/fa";

import styles from "./Photo.module.css"

const Photo = () => {

    const postId = useParams().id

    const [profilePic, setProfilePic] = useState('')
    const [name, setName] = useState('')
    const [contentPost, setContentPost] = useState('')
    const [postImageURL, setPostImageURL] = useState('')
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [postEmail, setPostEmail] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const getPhotoInfos = async(id) => {

        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            }
        })

        const res = await response.json()
        const post = res.post

        setProfilePic(post.profilePic)
        setName(post.name)
        setContentPost(post.contentPost)
        setPostImageURL(post.postImageURL)
        setLikes(post.likes)
        setComments(post.comments)
        setPostEmail(post.email)

    }

    useEffect(() => {
        setUserEmail(localStorage.getItem('userEmail'))
    }, [userEmail])

    useEffect(() => {

        getPhotoInfos(postId)

    }, [postId])

    const deleteComment = async(e, commentId) => {

        e.preventDefault()

        const deleteCommentInfos = {postId, commentId}

        const response = await fetch('http://localhost:3000/posts/delete/deleteComment', {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(deleteCommentInfos)
        })

        const res = await response.json()

        getPhotoInfos(postId)

        console.log(res)

    }

  return (
    <div className={styles.photoPage}>

        <div className={styles.container}>

            <div className={styles.leftSide}>

                <img src={postImageURL} className={styles.postImageURL}/>

            </div>

            <div className={styles.rightSide}>

                <div className={styles.userPhotoAndUserName}>

                    <img src={profilePic}/>

                    <h4>{name}</h4>

                </div>

                <div className={styles.contentPost}>
                    <p>{contentPost}</p>
                </div>

                <div className={styles.likesAndComments}>
                    <div>
                        {likes.length} Likes
                    </div>
                    |
                    <div>
                        {comments.length} Comments
                    </div>
                </div>

                <div className={styles.comments}>
                    { comments.length == 0 ? 

                        "No comments"

                        :
                        comments.map((comment) => (

                            <div key={comment.id} className={styles.commentContainer}>

                                <div className={styles.nameAndTrashCanButton}>

                                    <h4> {comment.name} </h4>

                                    {userEmail === postEmail &&
                                        <form onSubmit={(e) => deleteComment(e, comment.id)}>
                                            <button type="submit"> {<FaRegTrashAlt/>} </button>
                                        </form>
                                    }

                                </div>

                                <p> {comment.comment} </p>

                            </div>

                        ))
                    }
                </div>

            </div>

        </div>

    </div>
  )
}

export default Photo