
const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// Lấy danh sách tất cả sách
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ success: true, books });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách sách.", error: error.message });
    }
});

// Thêm sách mới
router.post("/", async (req, res) => {
    try {
        const { id, title, author, price, thumbnail, description, genre, quality } = req.body;

        if (!id || !title || !author || !price || !thumbnail || !description || !genre || !quality) {
            return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin sách." });
        }

        const existingBook = await Book.findOne({ id });
        if (existingBook) {
            return res.status(400).json({ success: false, message: "ID sách đã tồn tại." });
        }

        const newBook = new Book({ id, title, author, price, thumbnail, description, genre, quality });
        await newBook.save();
        res.status(201).json({ success: true, message: "Thêm sách thành công!", book: newBook });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi thêm sách.", error: error.message });
    }
});

// Cập nhật thông tin sách
router.put("/:id", async (req, res) => {
    try {
        const bookId = req.params.id;
        const updateData = req.body;

        const updatedBook = await Book.findOneAndUpdate({ id: bookId }, updateData, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sách cần cập nhật." });
        }

        res.status(200).json({ success: true, message: "Cập nhật sách thành công!", book: updatedBook });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật sách.", error: error.message });
    }
});

// Xóa sách
router.delete("/:id", async (req, res) => {
    try {
        const bookId = req.params.id;

        const deletedBook = await Book.findOneAndDelete({ id: bookId });
        if (!deletedBook) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sách cần xóa." });
        }

        res.status(200).json({ success: true, message: "Xóa sách thành công!", book: deletedBook });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi xóa sách.", error: error.message });
    }
});

module.exports = router;
