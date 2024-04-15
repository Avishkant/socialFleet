import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT username FROM likes WHERE postId = ?";

  db.query(q, [req.query.postId], (err, results) => {
    if (err) {
      console.error("Error fetching likes:", err);
      return res.status(500).json(err);
    }
    console.log(results);
    return res.status(200).json(results.map((like) => like.username));
  });
};

export const addLike = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Check if the user has already liked the post
    const checkQuery = "SELECT * FROM likes WHERE username = ? AND postId = ?";
    const checkValues = [userInfo.username, req.body.postId];

    db.query(checkQuery, checkValues, (checkErr, checkData) => {
      if (checkErr) {
        console.error("Error checking like:", checkErr);
        return res.status(500).json(checkErr);
      }

      if (checkData.length > 0) {
        // User has already liked the post
        return res.status(400).json("User has already liked this post.");
      }

      // If the user hasn't liked the post, insert the like
      const insertQuery =
        "INSERT INTO likes (`username`, `postId`) VALUES (?, ?)";
      const insertValues = [userInfo.username, req.body.postId];

      db.query(insertQuery, insertValues, (insertErr, insertData) => {
        if (insertErr) {
          console.error("Error adding like:", insertErr);
          return res.status(500).json(insertErr);
        }
        return res.status(200).json("Post has been liked.");
      });
    });
  });
};

export const deleteLike = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE `username` = ? AND `postId` = ?";

    db.query(q, [userInfo.username, req.query.postId], (err, data) => {
      if (err) {
        console.error("Error deleting like:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Post has been disliked.");
    });
  });
};
