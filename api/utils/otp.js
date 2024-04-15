import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const otpStore = new Map(); // save in memory data with key-value  pair

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_PRIVATE,
    pass: process.env.EMAIL_SECRET,
  },
});

export const sendOtp = async (email) => {
  const otp = generateOTP();
  console.log("i am here ");
  const mailOptions = {
    from: process.env.EMAIL_PRIVATE,
    to: email,
    subject: "OTP Verification for Dribble",
    html: ` <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="text-align: center; color: #333;">OTP Verification</h2>
    <p style="margin-bottom: 20px;">Hello,</p>
    <p style="margin-bottom: 20px;">Your OTP for Dribbble verification is:</p>
    <p style="font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px;">${otp}</p>
    <p style="margin-bottom: 20px;">Please use this OTP to complete the verification process.</p>
    <p style="margin-bottom: 20px;">If you didn't request this OTP, please ignore this email.</p>
    <p style="margin-bottom: 20px;">Thank you!</p>
    <a target="_blank" href="${process.env.SERVER_URL}/auth/user/verifymail?email=${email}&otp=${otp}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify OTP</a>
</div>`,
  };
  try {
    console.log("i am sening");
    await transporter.sendMail(mailOptions);
    console.log("send kr diya");
    otpStore.set(email, { otp, timestamp: Date.now() });
    return { isSuccess: true, msg: "OTP is sent to you email" };
  } catch (err) {
    console.log(err);
    return { isSuccess: false, msg: "Server error otp not sent" };
  }
};

export const verifyOtp = (otp, email) => {
  const storedOTP = otpStore.get(email);
  if (!storedOTP) {
    return { isVerify: false, msg: "Invalid email or OTP" };
  }

  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000; // 5 minutes in milliseconds
  if (storedOTP.timestamp < fiveMinutesAgo) {
    otpStore.delete(email);
    return { isVerify: false, msg: "OTP has expired" };
  }

  if (storedOTP.otp !== otp) {
    return { isVerify: false, msg: "Invalid OTP enter write otp" };
  }

  otpStore.delete(email);
  return { isVerify: true, msg: "Email verified successfully" };
};
