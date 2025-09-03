import jwt from 'jsonwebtoken';
import  generateOtp  from '../utils/generateOtp.js'; // or default import
import transporter from '../services/nodemailer.js'; // assuming you exported it
import { compare } from 'bcrypt';
import User from '../models/user.model.js'; // ✅ default import // Your user model

const otpStore = new Map(); // Temporary in-memory store
export const loginWithPassword= async(req, res) =>{
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !await compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const otp = generateOtp();
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

  await transporter.sendMail({
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });

  res.json({ success: true, message: 'OTP sent' });
 
}

export async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  otpStore.delete(email);
  res.json({ success: true, token });
}