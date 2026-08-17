import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// Estende o Request com userId
declare global {
  namespace Express {
    interface Request {
      userId: string; // Agora é obrigatório, não opcional
    }
  }
}

interface TokenPayload {
  userId: string
}

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não enviado"
    })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      error: "Token inválido"
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      "anime_secret"
    ) as TokenPayload

    if (!decoded.userId) {
      return res.status(401).json({
        error: "Token inválido: userId não encontrado"
      })
    }

    req.userId = decoded.userId

    next()
  } catch (error) {
    console.error("Erro na autenticação:", error)
    return res.status(401).json({
      error: "Token inválido ou expirado"
    })
  }
}