const express = require("express");
const router = express.Router();
const PaymentOrder = require("../models/PaymentOrder");
const Book = require("../models/Book");
const User = require("../models/User");

// API tạo đơn hàng thanh toán
router.post("/payment", async (req, res) => {
  const { username, bookIds } = req.body;
  
  if (!username || !bookIds) {
    return res.status(400).json({ error: "Missing username or bookIds" });
  }
  
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const books = await Book.find({ id: { $in: bookIds } });
    if (!books || books.length === 0) {
      return res.status(404).json({ error: "No books found" });
    }

    let total = 0;
    const booksInfo = books.map(book => {
      total += book.price;
      return {
        bookId: book.id,
        title: book.title,
        price: book.price,
      };
    });

    const newOrder = new PaymentOrder({
      buyerName: user.username,
      buyerEmail: user.email,
      books: booksInfo,
      totalAmount: total,
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({ error: error.message });
  }
});

// API lấy tất cả đơn hàng (cho admin)
router.get("/payments", async (req, res) => {
  try {
    const orders = await PaymentOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/payments/:id", async (req, res) => {
    try {
      const orderId = req.params.id; // "647b79d43b3d5b1c23db8b91"
      const order = await PaymentOrder.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      }
      res.json(order);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  });
  

module.exports = router;
