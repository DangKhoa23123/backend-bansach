const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const bookRoutes = require("./routers/books");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Kết nối MongoDB
mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Kết nối MongoDB thành công!"))
    .catch((err) => console.error("Kết nối MongoDB thất bại:", err));

// Định tuyến
app.use("/books", bookRoutes);

// Trang chính
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "bansach.html"));
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
