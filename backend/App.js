const express = require("express")

const cors = require("cors")

const app = express()
const port = 3000

const authRoutes = require("./routes/auth")
const postsRoutes = require("./routes/posts")

app.use(express.json())
app.use(cors({origin: 'http://127.0.0.1:5173'}))

app.use('/auth', authRoutes)
app.use('/posts', postsRoutes)

app.get("/", (req, res) => {

    res.send("Hello, World!")

})


app.listen(3000, () => {
    console.log(`Server running at port ${port}`)
})