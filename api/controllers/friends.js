import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getFriends = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const username = userInfo.username;

    const query = `
      SELECT u.username, u.email, u.name, u.coverPic, u.profilePic, u.city, u.website
      FROM users u
      JOIN relationships r ON u.username = r.followedUsername
      WHERE r.followerUsername = ?
    `;

    db.query(query, [username], (err, results) => {
      if (err) {
        console.error("Error fetching friends:", err);
        return res.status(500).json(err);
      }

      return res.status(200).json(results);
    });
  });
};

export const deleteFriend = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const followerUsername = userInfo.username;
    const followedUsername = parseInt(req.params.username); // Assuming you pass friend's ID as a parameter

    console.log(followerUsername);
    console.log(followedUsername);
    // Check if the relationship exists before attempting to delete it
    const checkQuery =
      "SELECT * FROM relationships WHERE `followerUsername` = ? AND `followedUsername` = ?";
    db.query(
      checkQuery,
      [followerUsername, followedUsername],
      (checkErr, checkResults) => {
        if (checkErr) {
          console.error("Error checking relationship:", checkErr);
          return res.status(500).json(checkErr);
        }

        if (checkResults.length === 0) {
          return res
            .status(400)
            .json(
              "Relationship does not exist or user has already unfollowed this user, so cannot unfollow."
            );
        }

        // If the relationship exists, proceed to delete it
        const deleteQuery =
          "DELETE FROM relationships WHERE `followerUsername` = ? AND `followedUsername` = ?";
        db.query(
          deleteQuery,
          [followerUsername, followedUsername],
          (deleteErr, deleteResults) => {
            if (deleteErr) {
              console.error("Error deleting relationship:", deleteErr);
              return res.status(500).json(deleteErr);
            }
            return res.status(200).json("Unfollowed successfully.");
          }
        );
      }
    );
  });
};
