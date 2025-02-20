const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// API tìm kiếm sách theo từ khóa
// Ví dụ: GET /search?q=keyword
router.get("/", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Chưa cung cấp từ khóa tìm kiếm" });
    }
    
    // Sử dụng regex để tìm kiếm không phân biệt chữ hoa, chữ thường trong các trường title, author, description
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    });
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
