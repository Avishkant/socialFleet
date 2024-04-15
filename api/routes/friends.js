import express from "express";
import { getFriends, deleteFriend } from "../controllers/friends.js";

const router = express.Router();

router.get("/find", getFriends); // user profile from serach results
router.delete("/find/:username", deleteFriend); // update user

export default router;
