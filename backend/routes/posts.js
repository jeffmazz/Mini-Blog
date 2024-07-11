const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")

/* Change Post Content Text */
router.post('/uptextpost', (req, res) => {

    const {email, contentPost, postId} = req.body

    if(!email || !contentPost || !postId) {
        return res.status(400).json({error:"Email, conteúdo de texto do post e id do Post são necessários para atualizar o post"})
    }

    const postsFilePath = path.join(__dirname, "..", "posts.json")

    fs.readFile(postsFilePath, 'utf-8', (err, data) => {

        if(err) {
            console.log(err)
            return res.status(500).json({error:"Erro ao analisar dados!"})
        }

        const postsData = JSON.parse(data)
        const posts = postsData.posts

        posts.forEach(post => {

            if(post.id === postId && post.email === email) {
                post.contentPost = contentPost
            }

        })

        fs.writeFile(postsFilePath, JSON.stringify({posts}, null, 2), 'utf-8', (err) => {

            if(err) {
                console.log(err)
                return res.status(400).json({error:"Erro ao atualizar conteúdo de texto do post!"})
            }

            return res.status(200).json({message:"Conteúdo de texto do post atualizado com sucesso!"})

        })

    })

})

/* Like a Post */
router.post("/like", async(req, res) => {

    const {postId, email} = req.body

    if(!postId || !email) {
        return res.status(404).json({error:"PostId e Email são necerrários para curtir uma foto!"})
    }

    const postsFilePath = path.join(__dirname, '..', 'posts.json')

    try {

        const data = await fs.promises.readFile(postsFilePath, 'utf-8')
        const postsData = JSON.parse(data)
        const posts = postsData.posts

        const updatedPosts = posts.map(post => {
            if(post.id === postId) {
                if(post.likes.includes(email)) {
                    post.likes = post.likes.filter(userLikerEmail => userLikerEmail !== email)
                } else {
                    post.likes.push(email)
                }
            }
            return post
        })

        await fs.promises.writeFile(postsFilePath, JSON.stringify({posts:updatedPosts}, null, 2), 'utf-8')

        res.status(200).json({message: "Photo Liked"})

    } catch(err) {
        console.log(err)
        return res.status(500).json({error:"Erro ao processar requisção"})
    }

})

/* GET POSTS */
router.get("/", (req, res) => {

    const usersFilePath = path.join(__dirname, '..', 'posts.json')

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {

        if(err) {
            return res.status(500).json({error: "Falha ao resgatar posts"})
        }

        const postsData = JSON.parse(data)
        const posts = postsData.posts

        return res.status(200).json({users:posts})

    })

})

/* TO DO A POST */
router.post("/", async(req, res) => {

    const {email, name, profilePic, contentPost, postImageURL, likes, comments} = req.body

    if(!email) {
        return res.status(404).json({error:"Usuário não encontrado!"})
    }

    if(!contentPost || !postImageURL) {
        return res.status(400).json({error:"Escreva algo ou poste alguma foto!"})
    }

    const id = Math.floor(Math.random() * 10000)
    
    const usersFilePath = path.join(__dirname, '..', 'posts.json')

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {

        if(err) {
            return res.status(500).json({error:"Erro ao ler posts"})
        }

        const postsData = JSON.parse(data)

        const posts = postsData.posts

        const newPost = {id, email, name, profilePic, contentPost, postImageURL, likes, comments}

        posts.push(newPost)

        fs.writeFile(usersFilePath, JSON.stringify({posts}, null, 2), 'utf-8', (err) => {

            if(err) {
                res.status(500).json({error:"Falha ao registrar novo post"})
            }

            res.status(200).json({message:"Post bem sucedido!"})

        })

    })

})

router.post("/comment", async(req, res) => {

    const {name, email, comment, photoId} = req.body

    if(!name || !comment || !photoId) {
        return res.status(500).json({error:"Todos os dados são necessários para fazer um comentário!"})
    }

    const postsFilePath = path.join(__dirname, "..", "posts.json")

    fs.readFile(postsFilePath, "utf-8", (err, data) => {

        if(err) {
            console.log(err)
            return res.status(450).json({error: "Erro ao analisar dados"})
        }

        const postsData = JSON.parse(data)
        const oldPosts = postsData.posts
        const id = Math.floor(Math.random() * 1000)
        const newComment = {id:id, name:name, email:email, comment:comment}

        const posts = oldPosts.map(post => {

            if(post.id == photoId) {
                post.comments.push(newComment)
            }

            return post

        })

        fs.writeFile(postsFilePath, JSON.stringify({posts}, null, 2), 'utf-8', (err) => {

            if(err) {
                return res.status(500).json({error:"Erro ao comentar foto!"})
            }

            return res.status(200).json({message:"Comentário feito com sucesso!"})

        })

    })

})

router.post("/:id", (req, res) => {

    const {id} = req.params

    const postsFilePath = path.join(__dirname, "..", "posts.json")

    fs.readFile(postsFilePath, 'utf-8', (err, data) => {

        if(err) {
            console.log(err)
            return res.status(500).json({error:"Erro ao analisar dados!"})
        }

        const postsData = JSON.parse(data)
        const posts = postsData.posts

        const post = posts.find(post => post.id === id)

        if(post) {
            return res.status(200).json({post:post})
        } else {
            return res.status(404).json({error:"Post não encontrado!"})
        }

    })

})

router.post("/delete/deleteComment", (req, res) => {

    const {postId, commentId} = req.body
    
    if(!postId || !commentId) {
        return res.status(500).json({error:"PostID e CommentID são necessários para deletar um comentário!"})
    }

    const postsFilePath = path.join(__dirname, "..", "posts.json")

    fs.readFile(postsFilePath, 'utf-8', (err, data) => {

        if(err) {
            console.log(err)
            return res.status(500).json({error:"Erro ao processar dados!"})
        }

        const postsData = JSON.parse(data)

        const posts = postsData.posts

        posts.forEach(post => {
            if(post.id === postId) {
                post.comments = post.comments.filter(comment => comment.id != commentId )
            }
        })

        fs.writeFile(postsFilePath, JSON.stringify({posts}, null, 2), 'utf-8', (err) => {

            if(err) {
                console.log(err)
                return res.status(400).json({error:"Erro ao deletar comentário!"})
            }

            return res.status(200).json({message:"Comentário deletado!"})

        })

    })

})



module.exports = router