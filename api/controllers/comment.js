import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.username AS username, name, profilePic FROM comments AS c JOIN users AS u ON (u.username = c.username)
    WHERE c.postId = ? ORDER BY c.createdAt DESC`;

  db.query(q, [req.query.postId], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(results);
  });
};

export const addComment = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  console.log(token);
  // const token = req.cookies.accessToken;    ---- any bug is occur with this

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments (`desc`, `createdAt`, `username`, `postId`) VALUES (?, ?, ?, ?)";
    console.log(userInfo);
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.username,
      req.body.postId,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error adding comment:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const deleteComment = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND `username` = ?";

    db.query(q, [commentId, userInfo.username], (err, data) => {
      if (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0)
        return res.status(200).json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};
