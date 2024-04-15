import express from "express";
import {
  login,
  register,
  logout,
  VerifyUserSendOtp,
  VerifyUserVerifyOtp,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getotp", VerifyUserSendOtp);
router.get("/verifymail", VerifyUserVerifyOtp);
router.post("/logout", logout);

export default router;
