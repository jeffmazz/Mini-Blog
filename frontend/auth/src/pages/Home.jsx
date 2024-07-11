import { useAuth } from "../context/AuthContext"

import { Link, useNavigate } from "react-router-dom"

import { useEffect, useState } from "react"

import styles from "./Home.module.css"

import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";


const Home = () => {

  const navigate = useNavigate()

  const { isAuthenticated } = useAuth()

  const [posts, setPosts] = useState([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePic, setProfilePic] = useState("")

  const [contentPost, setContentPost] = useState('')
  const [postImageURL, setPostImageURL] = useState("")

  /* GET USER EMAIL */
  useEffect(() => {

    setEmail(localStorage.getItem('userEmail'))

  }, [])

  /* GET USER PHOTO */
  useEffect(() => {

      const getUser = async() => {

          if(!email) return

          const response = await fetch("http://localhost:3000/auth/perfil", {
              method: "POST",
              headers: {
                  "Content-Type":"application/json"
              },
              body: JSON.stringify({email})
          })

          const res = await response.json()

          setName(res.name)
          setProfilePic(res.profilePic)

      }

      getUser()

  }, [email])

  /* HANDLE POST FUNCTION */
  const handlePost = async(e) => {

    e.preventDefault()

    const likes = []
    const comments = []

    const newPost = {email, name, profilePic, contentPost, postImageURL, likes, comments}

    const response = await fetch('http://localhost:3002/posts', {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(newPost)
    })

    const res = await response.json()
    console.log(res)

    if(response.ok) {
      getPosts()
    }

    setContentPost("")
    setPostImageURL("")
      
  }

  /* GET POSTS */

  const getPosts = async() => {

    const response = await fetch("http://localhost:3002/posts", {
      method: "GET",
      headers: {
        "Content-Type":"application/json"
      },
    })

    const posts = await response.json()

    console.log(posts)

    setPosts(posts.reverse())
    
  }

 useEffect(() => {
      getPosts()
  }, [])

  const handleLike = async(postId) => {

    const likeInfos = {postId, email}

    const response = await fetch("http://localhost:3000/posts/like", {
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(likeInfos)
    })

    const res = await response.json()

    if(response.ok) {
      getPosts()
    }

    console.log(res)

  }

/* COMMENT A PHOTO */
  
  const commentAPhoto = async(e, photoId) => {

    e.preventDefault()

    const comment = e.target.elements.comment.value

    const commentInfos = {name, email, comment, photoId}

    const response = await fetch("http://localhost:3000/posts/comment", {
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(commentInfos)
    })

    const res = await response.json()

    if(response.ok) {
      getPosts()
    }

    console.log(res)

    e.target.comment.value = ""
    
  }

  const changePostText = async(e, postId) => {

    e.preventDefault()

    const contentPost = e.target.elements.postTextContent.value

    const commentInfos = {email, contentPost, postId}

    const response = await fetch("http://localhost:3000/posts/uptextpost", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(commentInfos)
    })

    const res = await response.json()

    getPosts()

    e.target.elements.postTextContent.value = ""

  }

  return (
    <div className={styles.home}>

        {!isAuthenticated && <h2> You're not authenticated </h2>}

        {!isAuthenticated &&
          <p>
            <Link to="/login"> Login </Link>
            <Link to="/register"> Register </Link>
          </p>
        }

        {isAuthenticated &&

        <form onSubmit={handlePost}>
        
          <div className={styles.profilePicUser} style={{backgroundImage: `url('${profilePic}')`}} > </div>
        
          <input type="text"
          placeholder="Type what are you thinking about!"
          onChange={(e) => setContentPost(e.target.value)}
          value={contentPost}
          />

          <input type="text"
          placeholder="URL Image here (optional)"
          onChange={(e) => setPostImageURL(e.target.value)}
          value={postImageURL}
          />

          <button type="submit"> Publish </button>
        
        </form>
        }

        {posts.length == 0 ?
        
            <p> No posts yet ! </p>  

          :

            <div className={styles.posts}>
            
              {posts.map((post) => (

                <div key={post.id} className={styles.post}>

                  <div className={styles.creatorPostInfos}>

                    <img src={post.profilePic} alt={`${post.profilePic}`} className={styles.imgCreatorPost}/>

                    <div className={styles.nameAndContent}>

                      <div className={styles.userName}>
                        {post.name}
                      </div>

                      <div>
                        {post.contentPost}
                      </div>

                      <div className={styles.contentPost}>
                      {post.email === email &&
                          <form onSubmit={(e) => changePostText(e, post.id)}>
                            <input
                            type="text"
                            name="postTextContent"
                            placeholder="Change post text content!"
                            />
                            <button type="submit"> Edit </button>
                          </form>
                        }
                      </div>

                    </div>

                  </div>

                  {post.imageUrl == "" ? '' : <img src={post.postImageURL} className={styles.imgContent} alt="post" /> }

                  { isAuthenticated &&

                    <div className={styles.photoInfos}>

                      <div className={styles.likesAndComments}>

                        <div className={styles.photoLikes}>

                          <button onClick={() => handleLike(post.id)} className={styles.likeBtn}>

                              {post.likes.includes(email) ? <FaHeart className={styles.likeBtnFill}/> : <CiHeart className={styles.likeBtnEmpty}/>}

                          </button>

                            <p>{post.likes.length == 0 ? 'No ' : post.likes.length + " " } {post.likes.length == 1 ? 'like' : 'likes'}</p> 

                        </div>
                                            
                        <div className={styles.photoComments} onClick={() => navigate(`/${post.id}`)} >

                          <div>
                            <span>{post.comments.length}</span> Comments
                          </div>

                          <div>
                            {post.comments.length == 0 && "No Comments Yet"}
                              <span>{post.comments.length != 0 && post.comments[0].name}: </span> <p>{post.comments.length != 0 && post.comments[0].comment}</p>
                          </div>

                        </div>
                        
                      </div>

                      <form className={styles.commentForm} onSubmit={(e) => commentAPhoto(e, post.id)}>

                        <input type="text"
                        placeholder="Type your comment here!"
                        name="comment"
                        />

                        <button type="submit"> comment </button>

                      </form>

                    </div>

                  }

                </div>

              ))}

            </div>

        }

    </div>
  )
}

export default Home