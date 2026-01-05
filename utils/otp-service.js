import express from "express";
import dotenv from "dotenv";
import { sendEmail as sendMail } from "./send-email.js";
const app = express();
app.use(express.json());

const otps = new Map();

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export async function sendOtp(email) {
    if (!email) return { message: "email required", data: null, statusCode: 400 };
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otps.set(email, { otp, expiresAt });

    const subject = "Your OTP Code";
    const text = `Your OTP is ${otp}. It expires in 5 minutes.`;

    try {
        const info = await sendMail({ to: email, subject, message: text });
        if(!info.success) {
            return { ok: false, message: "Failed to send OTP email", error: info.error , statusCode: 500 };
        }
        return { ok: true, message: "OTP sent", info , statusCode: 200 };
    } catch (err) {
        console.error(err);
        return { ok: false, error: err.message, statusCode: 500 };
    }
}

export async function verifyOtp(req) {
    const { email, otp } = req.body;
    if (!email || !otp) return { message: "email and otp required", statusCode: 400 };

    const record = otps.get(email);
    if (!record) return { message: "no otp found" ,statusCode: 400 };

    if (Date.now() > record.expiresAt) {
        otps.delete(email);
        return { message: "otp expired", statusCode: 400 };
    }

    if (record.otp !== otp) return { message: `invalid otp ${record.otp}`, statusCode: 400  };

    otps.delete(email);
    return { ok: true, message: "otp verified" , statusCode: 200 };
}