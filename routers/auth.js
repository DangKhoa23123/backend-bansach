// routers/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Đăng ký người dùng
router.post("/register", async (req, res) => {
    const { email, username, phone, password } = req.body;

    if (!email || !username || !phone || !password) {
        return res.status(400).json({ success: false, error: "Thiếu thông tin bắt buộc." });
    }

    try {
        const newUser = new User({ email, username, phone, password });
        await newUser.save();
        res.json({ success: true, message: "Đăng ký thành công!" });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ success: false, error: "Email, số điện thoại hoặc username đã tồn tại." });
        } else {
            res.status(500).json({ success: false, error: "Lỗi server." });
        }
    }
});

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, error: "Thiếu thông tin bắt buộc." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, error: "Người dùng không tồn tại." });
        }

        if (password !== user.password) {
            return res.status(400).json({ success: false, error: "Sai mật khẩu." });
        }

        res.json({ success: true, message: "Đăng nhập thành công!", phone: user.phone });
    } catch (err) {
        res.status(500).json({ success: false, error: "Lỗi server." });
    }
});

module.exports = router;