import { Request, Response } from "express"
import { prisma } from "../helpers/prisma"

export async function getProfile(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    
    console.log("🔍 Buscando perfil do usuário ID:", id) // LOG

    if (!id) {
      return res.status(400).json({ error: "ID do usuário não fornecido" })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: { select: { followers: true, following: true, posts: true } }
      }
    })

    console.log("✅ Usuário encontrado:", user ? user.username : "NÃO ENCONTRADO") // LOG

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }
    
    return res.json(user)
  } catch (error) {
    console.error("❌ Erro ao buscar perfil:", error)
    return res.status(500).json({ error: "Erro ao buscar perfil" })
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.userId!
    const { username, bio, avatar } = req.body

    console.log(" Atualizando perfil do usuário:", userId) // LOG

    const user = await prisma.user.update({
      where: { id: userId },
      data: { username, bio, avatar },
      select: { id: true, username: true, email: true, bio: true, avatar: true }
    })

    return res.json(user)
  } catch (error) {
    console.error(" Erro ao atualizar perfil:", error)
    return res.status(500).json({ error: "Erro ao atualizar perfil" })
  }
}

export async function followUser(req: Request, res: Response) {
  try {
    const followerId = req.userId!
    const followingId = req.params.id as string

    console.log(`👤 ${followerId} seguindo ${followingId}`)

    if (followerId === followingId) {
      return res.status(400).json({ error: "Você não pode seguir a si mesmo" })
    }


    const targetUser = await prisma.user.findUnique({
      where: { id: followingId }
    })

    if (!targetUser) {
      return res.status(404).json({ error: "Usuário a ser seguido não encontrado" })
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    })

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } })
      console.log(" Deixou de seguir") // LOG
      return res.json({ following: false })
    }

    await prisma.follow.create({ data: { followerId, followingId } })
    console.log(" Começou a seguir") // LOG
    return res.json({ following: true })
  } catch (error) {
    console.error(" Erro ao seguir usuário:", error)
    return res.status(500).json({ error: "Erro ao seguir usuário" })
  }
}

export async function isFollowing(req: Request, res: Response) {
  try {
    const followerId = req.userId!
    const followingId = req.params.id as string

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    })

    return res.json({ following: !!existing })
  } catch (error) {
    console.error(" Erro ao verificar follow:", error)
    return res.status(500).json({ error: "Erro ao verificar follow" })
  }
}