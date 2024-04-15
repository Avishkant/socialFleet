import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from "../utils/otp.js";

export const register = (req, res) => {
  const { username, password, email, name } = req.body; // object destructuring

  try {
    // CHECK IF USER EXISTS
    db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          console.error("Error checking user while register controller:");
          console.log(err);
          return res.status(500).json({ msg: "internal server error" });
        }
        if (results.length > 0) {
          // If user exists with the provided username
          return res
            .status(409)
            .json({ msg: "User already exists with username" });
        }
        db.execute(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, results) => {
            if (err) {
              console.error("Error checking user while register controller:");
              console.log(err);
              return res.status(500).json({ msg: "internal server error" });
            }
            if (results.length > 0) {
              // If user exists with the provided email
              return res
                .status(409)
                .json({ msg: "User already exists with Email" });
            }

            // CREATE A NEW USER
            // Hash the password
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
              if (hashErr) {
                console.error(
                  "Error hashing password while Register controller:",
                  hashErr
                );
                return res.status(500).json({ msg: "internal server error" });
              }
              db.execute(
                "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)",
                [username, email, hashedPassword, name],
                (insertErr) => {
                  if (insertErr) {
                    console.error(
                      "Error while register controller creating user:"
                    );
                    console.log(insertErr);
                    return res
                      .status(500)
                      .json({ msg: "internal server error" });
                  }
                  return res
                    .status(200)
                    .json({ msg: "Register Successful......." });
                }
              );
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json("There is an internal server error");
  }
};

export const login = (req, res) => {
  const username = req.body.username;
  console.log(req.body);
  try {
    db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          console.log("Error While Login Controller");
          console.log(err);
          return res.status(500).json({ msg: "internal server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ msg: "User not found!" });
        }

        const checkPassword = bcrypt.compareSync(
          req.body.password,
          results[0].password
        );

        if (!checkPassword) {
          return res
            .status(400)
            .json({ msg: "Username and password does not match" });
        }
        const token = jwt.sign(results[0], "secretkey");
        const { password, ...others } = results[0];
        res.status(200).json({ token, ...others });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json("There is an internal server error");
  }
};

//THIS CAN BE HANDLE ON FRONTEND

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true, // Enable this if your application uses HTTPS
      sameSite: "none", // Adjust this based on your requirements
    })
    .status(200)
    .json("User has been logged out.");
};

export const VerifyUserSendOtp = async (req, res) => {
  try {
    console.log("start otp");
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [req.query.email],
      async (err, results) => {
        if (err) {
          console.error("Error fetching comments:", err);
          return res.status(500).json(err);
        }
        if (results.length > 0) {
          let user = results[0];
          const status = await sendOtp(user.email);
          if (status.isSuccess) {
            return res.status(200).send(status.msg);
          } else {
            console.log("OTP Sending failed");
            return res.status(500).send(status.msg);
          }
        } else {
          return res.status(400).json("User Not Found");
        }
      }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const VerifyUserVerifyOtp = async (req, res) => {
  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [req.query.email],
      async (err, results) => {
        if (err) {
          console.error("Error fetching user:", err);
          return res.status(500).json(err);
        }
        if (results.length > 0) {
          let user = results[0];
          const status = await verifyOtp(req.query.otp, user.email);
          if (status.isVerify) {
            // Update user's verification status in the database
            db.query(
              "UPDATE users SET isVerified = ? WHERE email = ?",
              [1, user.email],
              (updateErr, updateResults) => {
                if (updateErr) {
                  console.error(
                    "Error updating user verification status:",
                    updateErr
                  );
                  return res.status(500).json(updateErr);
                }
                console.log("User verification status updated successfully");
                return res.status(200)
                  .send(`<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center" ><div style="background-color: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9); text-align: center;">
              <h1 style="color: #333; margin-bottom: 20px;font-size: 5vw;">Email Verified!</h1>
              <p style="color: #666; line-height: 1.5; margin-bottom: 30px;">Thank you for verifying your email address. Your account is now active, and you can start exploring Dribbble.</p>
              <a href=${process.env.CLIENT_URL} class="btn-start" style="display: inline-block; background-color: #e73655; color: #fff; text-decoration: none;padding: 4vw 7vw;
              font-size: 4vw; border-radius: 4px; transition: background-color 0.3s ease;">Get Started</a>
            </div></div>`);
              }
            );
          } else {
            console.log("OTP verification failed");
            return res.status(400).send(status.msg);
          }
        } else {
          return res.status(400).json("User Not Found");
        }
      }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: error.message });
  }
};
