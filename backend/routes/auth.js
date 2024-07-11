const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

/* VERIFY */
router.post("/verify", async(req, res) => {

    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error:"Token não fornecido!"})
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, 'token_secret')
        return res.status(200).json({message:decoded})
    } catch(err) {
        console.log(err)
        return res.status(500).json({error:"Token inválido ou expirado!"})
    }

})

/* LOGIN */
router.post("/login", async(req, res) => {

    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({error: "Email e Senha são obrigatórios!"})
    }

    const usersFilePath = path.join(__dirname, "..", "users.json")

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {

        if(err) {
            return res.status(500).json({error: "Falha ao ler dados do sistema"})
        }

        try {

            const usersData = JSON.parse(data)

            const user = usersData.users.find(user => user.email === email)

            if(!user) {
                return res.status(401).json({error:"Email inválido!"})   
            }

            bcrypt.compare(password, user.password, (bcryptErr, result) => {

                if(bcryptErr) {
                    console.log("Erro ao comparar senhas", bcryptErr)
                    return res.status(500).json({error:"Senha inválida!"})
                }

                if(result) {

                    const token = jwt.sign({userId: user.id}, "token_secret", {expiresIn:"1h"
                    })

                    res.status(200).json({message:"Login bem sucedido!", token, userName:user.name, userEmail:user.email})
                } else {
                    res.status(500).json({error:"Email ou senha inválidos!"})
                }

            })

        } catch(err) {
        console.log(err)
        return res.status(500).json({error:"Falha ao processar dados no sistema!"})
        }

    })

})

/* REGISTER */
router.post("/register", async(req, res) => {

    // Obtendo os dados vindos do front-end
    const {name, email, password, confirmPassword} = req.body
    
    // Criando um ID para o novo usuário
    const id = Math.floor(Math.random()*100000)

    //Verificando se todos os dados vieram do front-end
    if(!name || !email || !password || !confirmPassword) {
        return res.status(400).json({error: "Todos os dados são obrigatórios!"})
    }

    // Outra verificação para ver se as senhas coincidem
    if(password !== confirmPassword) {
       return res.status(400).json({error: "As senhas não coincidem!"})
    }

    try {

        // Gerando hash da senha
        const passwordHash = await bcrypt.hash(password, 10)

        // Obtendo caminho de users.json com path.join
        const usersFilePath = path.join(__dirname, "..", 'users.json')

        // Lendo os arquivos de users.json
        fs.readFile(usersFilePath, "utf-8", (err, data) => {

            if(err) {
                console.log(err)
                return res.status(500).json({error: "Falha ao ler os dados dos usuários!"})
            }

            // transformando nosso arquivo json em um array para manipulá-lo
            const usersData = JSON.parse(data)
            const users = usersData.users
            
            // Verificando se o email recebido já existe no sistema
            if(users.find(user => user.email === email)) {
                return res.status(400).json({error: "Email já registrado!"})
            }

            // Usuário a ser registrado
            const newUser = {
                id,
                name,
                email,
                password: passwordHash
            }

            // Enviando o novo usuário para o sistema
            users.push(newUser)

            // Reescrevendo o arquivo users.json com os dados atualizados
            fs.writeFile(usersFilePath, JSON.stringify({users}, null, 2), 'utf-8', (err) => {

                if(err) {
                    console.log(err)
                    res.status(500).json({error: "Falha ao registrar novo usuário!"})
                }

                const token = jwt.sign({userId: newUser.id}, 'token_secret', {expiresIn:'1h'})

                res.status(200).json({message: "Registro bem sucedido!", token})

            })

        })

    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Falha ao registrar usuário!"})
    }

})

router.post("/perfil", (req, res) => {

    const {email} = req.body

    if(!email) {
        return res.status(400).json({error: "Falha ao analisar email usuário"})
    }

    const usersFilePath = path.join(__dirname, "..", 'users.json')

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {

        if(err) {
            return res.status(500).json({error: "Falha ao analisar dados de usuários"})
        }
        
        const usersData = JSON.parse(data)
        const users = usersData.users
    
        const user = users.find(user => user.email === email)

        if(user) {
            return res.status(200).json(user)
        }

    })

})

router.post("/att", (req, res) => {

    const {email, name, profilePic} = req.body

    if(!email) {
        return res.status(400).json({error:"Email necessário!"})
    }

    const usersFilePath = path.join(__dirname, "..", 'users.json')
    
    const postsFilePath = path.join(__dirname, '..', 'posts.json')

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {

        if(err) {
            return res.status(500).json({error:"Falha ao analisar dados"})
        }

        const usersData = JSON.parse(data)
        let users = usersData.users

        const user = users.find(user => user.email === email)

        if(!user) {
            return res.status(404).json({error:"Usuário não encontrado!"})
        }

        const updatedUser = {
            id: user.id,
            name: name ? name : user.name,
            email: email,
            password: user.password,
            profilePic: profilePic ? profilePic : user.profilePic
        }

        users = users.filter(user => user.id !== updatedUser.id)
        users.push(updatedUser)

        fs.writeFile(usersFilePath, JSON.stringify({users}, null, 2), 'utf-8', (err) => {

            if(err) {
                return res.status(500).json({error:"Falha ao atualizar dados do usuário"})
            }

            res.status(200).json({message:"Usuário atualizado com sucesso!"})

        })

    })

    fs.readFile(postsFilePath, 'utf-8', (err, data) => {

        if(err) {
            return res.status(500).json({error:"Falha ao recuperar dados"})
        }
        
        const postsData = JSON.parse(data)
        let posts = postsData.posts

        posts.forEach(post => {

            if(post.email === email) {
                post.name = name || post.name
                post.profilePic = profilePic || post.profilePic
            }

        })
        
        posts.forEach(post => {

            post.comments.forEach(postComment => {

                if(postComment.email === email) {
                    postComment.name = name || postComment.name
                }

            })

        })

        fs.writeFile(postsFilePath, JSON.stringify({posts}, null, 2), 'utf-8', (err) => {

            if(err) {
                return res.status(500).json({error:"Erro ao atualizar informações do post"})
            }

        })

    })

})

module.exports = router