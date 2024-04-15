import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  getSelfPosts,
  getSelfPostsOther,
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/self", getSelfPosts);
router.get("/self/other", getSelfPostsOther);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
