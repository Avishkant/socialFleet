import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUsers = (req, res) => {
  const username = req.query.username;
  const startingWord = username + "%"; // Add a wildcard % at the end to search for usernames that start with 'username'

  const q = "SELECT * FROM users WHERE username LIKE ?";

  db.query(q, [startingWord], (err, results) => {
    if (err) {
      console.error("Error fetching users by starting word:", err);
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(404).json("Users not found!");
    }

    const userInfos = results.map((result) => {
      const { password, ...info } = result; // remove password from users details
      return info;
    });

    return res.json(userInfos);
  });
};

export const getSingleUser = (req, res) => {
  const username = req.params.username;
  const q = "SELECT * FROM users WHERE username=?";

  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) {
      const { password, ...info } = data[0];
      return res.json(info);
    } else res.status(400).json("user not Exits");
  });
};

export const updateUser = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) {
    console.log("You need to pass accessToken with  cookie");
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name` = ?, `city` = ?, `website` = ?, `profilePic` = ?, `coverPic` = ? WHERE username = ?";

    const { name, city, website, profilePic, coverPic } = req.body;
    const change = [
      name ? name : userInfo.name,
      city ? city : userInfo.city,
      website ? website : userInfo.website,
      profilePic ? profilePic : userInfo.profilePic,
      coverPic ? coverPic : userInfo.coverPic,
      userInfo.username,
    ];
    db.query(q, change, (err, data) => {
      if (err) {
        console.error("Error updating user:");
        console.log(err);
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0) {
        console.log(data);
        return res.status(200).json("Update Successful!");
      }
      return res.status(403).json("You can update only your profile!");
    });
  });
};

export const deleteUser = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) {
    console.log("You need to pass accessToken with a cookie");
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "SELECT * FROM users WHERE id=?";
    db.query(q, [userInfo.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(200).json("Not A user ");
      else {
        // Delete user's comments
        const deleteCommentsQuery = "DELETE FROM comments WHERE `username` = ?";
        db.query(
          deleteCommentsQuery,
          [userInfo.username],
          (commentsErr, commentsData) => {
            if (commentsErr) {
              console.error("Error deleting comments:", commentsErr);
              return res.status(500).json(commentsErr);
            }

            // Delete user's stories
            const deleteStoriesQuery =
              "DELETE FROM stories WHERE `username` = ?";
            db.query(
              deleteStoriesQuery,
              [userInfo.username],
              (storiesErr, storiesData) => {
                if (storiesErr) {
                  console.error("Error deleting stories:", storiesErr);
                  return res.status(500).json(storiesErr);
                }

                // Delete user's relationships (both follower and followed)
                const deleteRelationshipsQuery =
                  "DELETE FROM relationships WHERE `followerUsername` = ? OR `followedUsername` = ?";
                db.query(
                  deleteRelationshipsQuery,
                  [userInfo.username, userInfo.username],
                  (relationshipsErr, relationshipsData) => {
                    if (relationshipsErr) {
                      console.error(
                        "Error deleting relationships:",
                        relationshipsErr
                      );
                      return res.status(500).json(relationshipsErr);
                    }

                    // Finally, delete the user
                    const deleteUserQuery = "DELETE FROM users WHERE `id` = ?";
                    db.query(
                      deleteUserQuery,
                      [userInfo.username],
                      (userErr, userData) => {
                        if (userErr) {
                          console.error("Error deleting user:", userErr);
                          return res.status(500).json(userErr);
                        }

                        return res.json(
                          "User and related data have been deleted."
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    });
  });
};
