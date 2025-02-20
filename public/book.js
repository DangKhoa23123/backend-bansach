        let editing = false;
        
        // Load books when page loads
        document.addEventListener('DOMContentLoaded', loadBooks);

        // Handle form submission
        document.getElementById('bookForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('id', editing ? document.getElementById('bookId').value : Date.now().toString());
            formData.append('title', document.getElementById('title').value);
            formData.append('author', document.getElementById('author').value);
            formData.append('price', document.getElementById('price').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('genre', document.getElementById('genre').value);
            formData.append('quality', document.getElementById('quality').value);
            formData.append('pageCount', document.getElementById('pageCount').value);
            formData.append('giamgia', document.getElementById('giamgia').value);

            
            const thumbnailInput = document.getElementById('thumbnail');
            if (thumbnailInput.files[0]) {
                formData.append('thumbnail', thumbnailInput.files[0]);
            }

            try {
                const url = editing ? `/api/books/${document.getElementById('bookId').value}` : '/api/books';
                const method = editing ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    body: formData
                });

                if (response.ok) {
                    resetForm();
                    loadBooks();
                } else {
                    alert('Error saving book');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Error saving book');
            }
        });

        // Load all books
        async function loadBooks() {
            try {
                const response = await fetch('/api/books');
                const books = await response.json();
                
                const bookList = document.getElementById('bookList');
                bookList.innerHTML = '';
                
                books.forEach(book => {
                    const bookCard = createBookCard(book);
                    bookList.appendChild(bookCard);
                });
            } catch (err) {
                console.error('Error:', err);
                alert('Error loading books');
            }
        }

        // Create book card
        function createBookCard(book) {
            const div = document.createElement('div');
            div.className = 'col-md-4 book-card';
            div.innerHTML = `
                <div class="card">
                    <img src="${book.thumbnail}" class="card-img-top book-image" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">
                            <strong>Author:</strong> ${book.author}<br>
                            <strong>Price:</strong> $${book.price}<br>
                            <strong>Genre:</strong> ${book.genre}<br>
                            <strong>Quality:</strong> ${book.quality}/100
                            <strong>Pages:</strong> ${book.pageCount} pages
                            <strong>giamgia:</strong> ${book.giamgia}<br>
                            
                        </p>
                        <p class="card-text">${book.description}</p>
                        <button class="btn btn-primary btn-sm" onclick="editBook('${book.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBook('${book.id}')">Delete</button>
                    </div>
                </div>
            `;
            return div;
        }

        // Edit book
        async function editBook(id) {
            try {
                const response = await fetch(`/api/books`);
                const books = await response.json();
                const book = books.find(b => b.id === id);
                
                if (book) {
                    document.getElementById('bookId').value = book.id;
                    document.getElementById('title').value = book.title;
                    document.getElementById('author').value = book.author;
                    document.getElementById('price').value = book.price;
                    document.getElementById('description').value = book.description;
                    document.getElementById('genre').value = book.genre;
                    document.getElementById('quality').value = book.quality;
                    document.getElementById('pageCount').value = book.pageCount;
                    document.getElementById('giamgia').value = book.giamgia;
                    
                    document.getElementById('formTitle').textContent = 'Edit Book';
                    document.getElementById('thumbnail').required = true;
                    editing = true;
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Error loading book details');
            }
        }

        // Delete book
        async function deleteBook(id) {
            if (confirm('Are you sure you want to delete this book?')) {
                try {
                    const response = await fetch(`/api/books/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        loadBooks();
                    } else {
                        alert('Error deleting book');
                    }
                } catch (err) {
                    console.error('Error:', err);
                    alert('Error deleting book');
                }
            }
        }

        // Reset form
        function resetForm() {
            document.getElementById('bookForm').reset();
            document.getElementById('bookId').value = '';
            document.getElementById('formTitle').textContent = 'Add New Book';
            document.getElementById('thumbnail').required = true;
            editing = false;
        }
