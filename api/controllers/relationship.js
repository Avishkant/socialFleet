import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getFollowersWithData = (req, res) => {
  const q =
    "SELECT r.followerUsername, u.name ,u.profilePic " +
    "FROM relationships r " +
    "JOIN users u ON r.followerUsername = u.username " +
    "WHERE r.followedUsername = ?";

  db.query(q, [req.query.followedUsername], (err, results) => {
    if (err) {
      console.error("Error fetching relationships:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(results);
  });
};
export const getFollowingWithData = (req, res) => {
  const q =
    "SELECT r.followedUsername, u.name ,u.profilePic " +
    "FROM relationships r " +
    "JOIN users u ON r.followedUsername = u.username " +
    "WHERE r.followerUsername = ?";

  db.query(q, [req.query.followerUsername], (err, results) => {
    if (err) {
      console.error("Error fetching relationships:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(results);
  });
};
export const getFollowersOnlyUsername = (req, res) => {
  const q =
    "SELECT followerUsername FROM relationships WHERE followedUsername = ?";

  db.query(q, [req.query.followedUsername], (err, results) => {
    if (err) {
      console.error("Error fetching relationships:", err);
      return res.status(500).json(err);
    }
    return res
      .status(200)
      .json(results.map((relationship) => relationship.followerUsername));
  });
};
export const getFollowingOnlyUsername = (req, res) => {
  const q =
    "SELECT followedUsername FROM relationships WHERE followerUsername = ?";

  db.query(q, [req.query.followerUsername], (err, results) => {
    if (err) {
      console.error("Error fetching relationships:", err);
      return res.status(500).json(err);
    }
    return res
      .status(200)
      .json(results.map((relationship) => relationship.followedUsername));
  });
};

export const follow = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO relationships (`followerUsername`, `followedUsername`) VALUES (?, ?)";
    const values = [userInfo.username, req.body.username];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error adding relationship:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Following");
    });
  });
};

export const unFollow = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const followerUsername = userInfo.username;
    const followedUsername = req.query.username;

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
              "Relationship does not exist or user Alredy unfollow this user so , cannot unfollow."
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
