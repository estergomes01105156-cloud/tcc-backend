import { Request, Response } from "express"
import { prisma } from "../helpers/prisma"
import { Router } from "express"
import {createPost, getPosts, addComment, deletePost } from "../controllers/posts"
import { auth } from "../middlewares/auth"

const router = Router()

router.post("/", auth, createPost)
router.get("/", getPosts)
router.post("/:postId/comments", auth, addComment)

// Rota para excluir post
router.delete("/:id", auth, deletePost)

export default router
