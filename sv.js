const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Cấu hình middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình static files - QUAN TRỌNG
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập Multer để upload file
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('thumbnail');

// Kiểm tra loại file
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Book Schema
const bookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    quality: { type: Number, required: true }
});

const Book = mongoose.model('Book', bookSchema);

// Route cho trang chủ - QUAN TRỌNG
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
// Lấy tất cả sách
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm sách mới
app.post('/api/books', upload, async (req, res) => {
    const book = new Book({
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        thumbnail: `/uploads/${req.file.filename}`,
        description: req.body.description,
        genre: req.body.genre,
        quality: req.body.quality
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật sách
app.put('/api/books/:id', upload, async (req, res) => {
    try {
        const book = await Book.findOne({ id: req.params.id });
        if (req.body.title) book.title = req.body.title;
        if (req.body.author) book.author = req.body.author;
        if (req.body.price) book.price = req.body.price;
        if (req.file) book.thumbnail = `/uploads/${req.file.filename}`;
        if (req.body.description) book.description = req.body.description;
        if (req.body.genre) book.genre = req.body.genre;
        if (req.body.quality) book.quality = req.body.quality;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa sách
app.delete('/api/books/:id', async (req, res) => {
    try {
        await Book.deleteOne({ id: req.params.id });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));