import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '@prisma/client/runtime'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(cors())
const port = 5000

app.get('/', (req, res) => {
    res.send(`
    <ul> Recourses 
    <li><a href="/users"> Users </a></li>
    <li><a href="/posts"> Posts </a></li>
    </ul>
    `)
})

app.get('/posts', async (req, res) => {
    const posts = await prisma.post.findMany({ include: { author: true, likes: true, comments:{include: {user:true}} } })
    res.send(posts)
})

app.get('/posts/:id', async (req, res)=>{
    const id=Number(req.params.id)
    const singlePost= await prisma.post.findUnique({where: {id:id}, include: {author:true, likes:true, comments: {include: {user:true} }}})
    if(singlePost){
        res.send(singlePost)
    }
    else{
        res.status(404).send({error: "Post not found."})
    }
})

app.get('/users', async (req, res)=>{
    const users = await prisma.user.findMany({include: {posts:true}})
    res.send(users)
})

app.post('/posts', async (req, res)=>{
    await prisma.post.create({data: req.body})
    const posts = await prisma.post.findMany({ include: { author: true, likes: true, comments:{include: {user:true}} } })
    res.send(posts)
})

app.post('/likes', async (req, res)=>{
    await prisma.likes.create({data: req.body})
    const posts = await prisma.post.findMany({ include: { author: true, likes: true, comments:{include: {user:true}} } })
    res.send(posts)
})

app.post('/comments', async (req, res)=>{
    await prisma.comments.create({data:req.body, include:{user:true}})
    const posts = await prisma.post.findMany({ include: { author: true, likes: true, comments:{include: {user:true}} } })
    res.send(posts)
})

app.listen(port)