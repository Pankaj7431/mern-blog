import express, { Router } from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  CreatePost,
  DeletePost,
  GetPosts,
  UpdatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, CreatePost);
router.get("/getposts", GetPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, DeletePost);
router.put("/updatepost/:postId/:userId", verifyToken, UpdatePost);
export default router;
