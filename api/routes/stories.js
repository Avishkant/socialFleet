import express from "express";
import { getStories, deleteStory } from "../controllers/story.js";

const router = express.Router();

router.get("/", getStories);
router.delete("/:id", deleteStory);

export default router;
