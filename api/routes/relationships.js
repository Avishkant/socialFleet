import express from "express";
import {
  getFollowersOnlyUsername,
  follow,
  unFollow,
  getFollowersWithData,
  getFollowingOnlyUsername,
  getFollowingWithData,
} from "../controllers/relationship.js";

const router = express.Router();

router.get("/followers/onlyusername", getFollowersOnlyUsername);
router.get("/following/onlyusername", getFollowingOnlyUsername);
router.get("/following/withdata", getFollowingWithData);
router.get("/followers/withdata", getFollowersWithData);
router.post("/", follow);
router.delete("/", unFollow);

export default router;
