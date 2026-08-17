import { Router } from "express";
import { deletePost } from "../controllers/delete";

const router = Router();

router.delete("/posts/:id", deletePost);

export default router;
