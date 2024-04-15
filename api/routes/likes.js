import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/like.js";

const router = express.Router()

router.post("/", addLike)
router.get("/", getLikes)
router.delete("/", deleteLike)


export default router