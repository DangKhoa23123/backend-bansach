const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String},
    genre: { type: String, required: true },
    quality: { type: Number, required: true },
    pageCount: { type: Number, required: true },
    giamgia : { type: String },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
