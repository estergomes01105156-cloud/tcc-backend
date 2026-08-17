import { Router } from "express";
import { getProfile, updateProfile, followUser, isFollowing } from "../controllers/users";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/:id", auth, getProfile);
router.put("/", auth, updateProfile);
router.post("/:id/follow", auth, followUser);
router.get("/:id/following", auth, isFollowing);

export default router;