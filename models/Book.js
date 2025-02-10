
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    quality: { type: Number, required: true },
});

module.exports = mongoose.model("Book", BookSchema);
