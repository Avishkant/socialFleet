import express from "express";
import {
  getUsers,
  updateUser,
  getSingleUser,
  deleteUser,
} from "../controllers/user.js";

const router = express.Router();

router.get("/find", getUsers); // Search any other users by his username
router.get("/find/:username", getSingleUser); // user profile from serach results
router.put("/", updateUser); // update user
router.delete("/", deleteUser); // update user

export default router;
