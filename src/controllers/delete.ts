import { Request, Response } from "express";
import { prisma } from "../helpers/prisma";

export async function deletePost(req: Request, res: Response) {
  const id = String(req.params.id);

  console.log("ID recebido:", id);

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    console.log("Post encontrado:", post);

    if (!post) {
      return res.status(404).json({
        error: "Post não encontrado",
      });
    }

    await prisma.like.deleteMany({
      where: {
        postId: id,
      },
    });

    await prisma.bookmark.deleteMany({
      where: {
        postId: id,
      },
    });

    await prisma.comment.deleteMany({
      where: {
        postId: id,
      },
    });

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Post excluído com sucesso",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao excluir post",
    });
  }
}