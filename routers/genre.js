const express = require("express");
const router = express.Router();
const Book = require("../models/Book"); // Đảm bảo import đúng

// API lấy sách Văn học nước ngoài
router.get("/foreign-literature", async (req, res) => {
    try {
        const books = await Book.find({ genre: "Văn học nước ngoài" }); // Kiểm tra biến Book
        res.json(books);
    } catch (err) {
        console.error("Lỗi khi lấy sách:", err); // Hiển thị lỗi trong terminal
        res.status(500).json({ error: err.message }); // Trả lỗi chi tiết về frontend
    }
});

module.exports = router;
