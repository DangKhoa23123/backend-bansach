const express = require("express");
const router = express.Router();
const Book = require("../models/Book"); // Import model Book

// API lấy sách theo thể loại
router.get("/:genre", async (req, res) => {
    try {
        const genre = req.params.genre.replace("-", " "); // "foreign-literature" -> "Văn học nước ngoài"
        console.log(`🔍 Tìm sách với thể loại: ${genre}`); // Debug

        const books = await Book.find({ genre });

        console.log(`📚 Sách tìm thấy:`, books); // Debug kết quả

        if (books.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy sách cho thể loại: ${genre}` });
        }

        res.json(books);
    } catch (err) {
        console.error("❌ Lỗi khi lấy sách:", err);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách sách!" });
    }
});

module.exports = router;

