const mongoose = require("mongoose");

const paymentOrderSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  books: [
    {
      bookId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PaymentOrder", paymentOrderSchema);
