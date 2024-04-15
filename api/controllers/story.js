import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
  deleteOldStories();
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT u.username, u.profilePic, s.media, s.createdAt
      FROM users u
      JOIN stories s ON u.username = s.username
      WHERE u.username = ? OR u.username IN (
        SELECT r.followedUsername
        FROM relationships r
        WHERE r.followerUsername = ?
      )
      ORDER BY u.username = ? DESC, s.createdAt DESC
    `;

    db.query(
      q,
      [userInfo.username, userInfo.username, userInfo.username],
      (err, results) => {
        if (err) {
          console.error("Error fetching stories:", err);
          return res.status(500).json(err);
        }

        // Grouping stories by username
        const storiesByUser = results.reduce((acc, cur) => {
          if (!acc[cur.username]) {
            acc[cur.username] = {
              username: cur.username,
              profilePic: cur.profilePic,
              activeStories: [],
            };
          }
          acc[cur.username].activeStories.push({
            media: cur.media,
            createdAt: cur.createdAt,
          });
          return acc;
        }, {});

        // Formatting the response as an array of objects
        const response = Object.values(storiesByUser);

        return res.status(200).json(response);
      }
    );
  });
};

export const addStory = (req, res) => {
  deleteOldStories();
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO stories (`img`, `createdAt`, `username`) VALUES (?, ?, ?)";
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.username,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error adding story:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Story has been created.");
    });
  });
};

export const deleteStory = (req, res) => {
  deleteOldStories();
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM stories WHERE `id` = ? AND `username` = ?";

    db.query(q, [req.params.id, userInfo.username], (err, data) => {
      if (err) {
        console.error("Error deleting story:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0)
        return res.status(200).json("Story has been deleted.");
      return res.status(403).json("You can delete only your story!");
    });
  });
};

export const deleteOldStories = () => {
  const q = `
  DELETE FROM stories
  WHERE createdAt < ?
  `;
  const twentyFourHoursAgo = moment().subtract(24, "hours").toDate();
  // Get the time 24 hours ago
  db.query(q, [twentyFourHoursAgo], (err, result) => {
    if (err) {
      console.error("Error deleting old stories:", err);
      return;
    }
    console.log("Old stories deleted successfully.");
  });
};
