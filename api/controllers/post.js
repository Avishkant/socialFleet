import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const username = req.query.username;
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) {
    console.log("To get posts, you need to provide username and accessToken");
    console.log(`You have username = ${username} and token = ${token}`);
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
    SELECT DISTINCT p.*, u.username AS username, name, profilePic
    FROM posts AS p
    JOIN users AS u ON u.username = p.username
    LEFT JOIN relationships AS r ON (p.username = r.followedUsername OR p.username = r.followerUsername)
    WHERE p.username = ? OR r.followerUsername = ?
    ORDER BY p.createdAt DESC
    
    `;

    const values = [username, username];

    db.query(q, values, (err, results) => {
      if (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json(err);
      }
      console.log(results);
      return res.status(200).json(results);
    });
  });
};

export const getSelfPosts = (req, res) => {
  const usernameFromQuery = req.query.username;
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];

  // Check if token and username are provided
  if (!token || !usernameFromQuery) {
    console.log(
      "To get posts, you need to provide both username and accessToken"
    );
    console.log(
      `You have username = ${usernameFromQuery} and token = ${token}`
    );
    return res.status(401).json("Not logged in or username not provided!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Check if the username from the token matches the username from the query
    if (userInfo.username !== usernameFromQuery) {
      console.log(
        "Unauthorized access. Username from token does not match the provided username."
      );
      return res.status(403).json("Unauthorized access.");
    }

    // If token is valid and the provided username matches the username from the token
    // Fetch posts for the provided username
    const q = `
    SELECT DISTINCT p.*, u.username AS username, name, profilePic
    FROM posts AS p
    JOIN users AS u ON u.username = p.username
    WHERE p.username = ?
    `;

    db.query(q, [usernameFromQuery], (err, results) => {
      if (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json(err);
      }

      return res.status(200).json(results);
    });
  });
};
export const getSelfPostsOther = (req, res) => {
  const usernameFromQuery = req.query.username;
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];

  // Check if token and username are provided
  if (!token || !usernameFromQuery) {
    console.log(
      "To get posts, you need to provide both username and accessToken"
    );
    console.log(
      `You have username = ${usernameFromQuery} and token = ${token}`
    );
    return res.status(401).json("Not logged in or username not provided!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // If token is valid and the provided username matches the username from the token
    // Fetch posts for the provided username
    const q = `
    SELECT DISTINCT p.*, u.username AS username, name, profilePic
    FROM posts AS p
    JOIN users AS u ON u.username = p.username
    WHERE p.username = ?
    `;

    db.query(q, [usernameFromQuery], (err, results) => {
      if (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json(err);
      }

      return res.status(200).json(results);
    });
  });
};

export const addPost = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `username`) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.username,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error adding post:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) {
    console.log("no accessToken, give token in Header by cookies");
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id` = ? AND `username` = ?";

    db.query(q, [req.params.id, userInfo.username], (err, data) => {
      if (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post.");
    });
  });
};
