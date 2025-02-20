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
  // Trạng thái đơn hàng: 'pending', 'confirmed', 'cancelled'
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const PaymentOrder = mongoose.model("PaymentOrder", paymentOrderSchema);
module.exports = PaymentOrder;
