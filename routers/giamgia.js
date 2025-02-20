const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// API lấy sách có giảm giá (có giá trị "Giảm giá")
router.get("/", async (req, res) => {
  try {
    const discountedBooks = await Book.find({ giamgia: "Giảm giá" });
    res.json(discountedBooks);
  } catch (err) {
    console.error("Lỗi khi lấy sách giảm giá:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
