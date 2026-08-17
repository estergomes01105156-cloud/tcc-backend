import { Request, Response } from "express";
import { prisma } from "../helpers/prisma";

export async function createPost(req: Request, res: Response) {
  try {
    // Verifica se o body existe
    if (!req.body) {
      return res.status(400).json({ error: "Dados não enviados" });
    }

    const { content, imageUrl } = req.body;

    // O userId é adicionado pelo middleware auth
    // e já está disponível em req.userId
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Valida o conteúdo
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Conteúdo do post é obrigatório" });
    }

    console.log("Criando post para usuário:", userId);
    console.log("Dados:", { content: content.trim(), imageUrl: imageUrl || null });

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        imageUrl: imageUrl || null,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    console.log("Post criado com sucesso:", post.id);

    return res.status(201).json(post);
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return res.status(500).json({
      error: "Erro ao criar post",
    });
  }
}

export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return res.status(500).json({
      error: "Erro ao buscar posts",
    });
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    const { content } = req.body;
    const postId = String(req.params.postId);

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Conteúdo do comentário é obrigatório" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post não encontrado",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    return res.status(500).json({
      error: "Erro ao adicionar comentário",
    });
  }
}

export async function deletePost(req: Request, res: Response) {
  const id = String(req.params.id);

  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post não encontrado",
      });
    }

    // Verifica se o usuário é o autor do post
    if (post.authorId !== userId) {
      return res.status(403).json({
        error: "Você não tem permissão para deletar este post",
      });
    }

    // Deleta em ordem para evitar problemas de chave estrangeira
    await prisma.comment.deleteMany({
      where: {
        postId: id,
      },
    });

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

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Post excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir post:", error);
    return res.status(500).json({
      error: "Erro ao excluir post",
    });
  }
}

export async function likePost(req: Request, res: Response) {
  try {
    const postId = String(req.params.id || req.params.postId);

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post não encontrado",
      });
    }

    // Verifica se já existe like
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Remove o like
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return res.status(200).json({ liked: false });
    } else {
      // Adiciona o like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error("Erro ao processar like:", error);
    return res.status(500).json({
      error: "Erro ao processar like",
    });
  }
}

export async function bookmarkPost(req: Request, res: Response) {
  try {
    const postId = String(req.params.id || req.params.postId);

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post não encontrado",
      });
    }

    // Verifica se já existe bookmark
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
      // Remove o bookmark  
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return res.status(200).json({ bookmarked: false });
    } else {
      // Adiciona o bookmark
      await prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      });
      return res.status(200).json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Erro ao processar bookmark:", error);
    return res.status(500).json({
      error: "Erro ao processar bookmark",
    });
  }
}