document.addEventListener("DOMContentLoaded", fetchBooks);

let editingBookId = null; // Biến để kiểm tra xem có đang chỉnh sửa không

async function fetchBooks() {
    try {
        const response = await fetch('/books');
        const data = await response.json();
        const booksList = document.getElementById("books-list");
        booksList.innerHTML = "";

        if (data.success) {
            data.books.forEach(book => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${book.id}</td>
                    <td><img src="${book.thumbnail}" width="50"></td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.price} đ</td>
                    <td>${book.genre}</td>
                `;

                let actions = document.createElement("td");
                
                let editBtn = document.createElement("button");
                editBtn.className = "btn btn-warning btn-sm me-2";
                editBtn.textContent = "Sửa";
                editBtn.onclick = () => editBook(book);
                actions.appendChild(editBtn);

                let deleteBtn = document.createElement("button");
                deleteBtn.className = "btn btn-danger btn-sm";
                deleteBtn.textContent = "Xóa";
                deleteBtn.onclick = () => deleteBook(book.id);
                actions.appendChild(deleteBtn);

                row.appendChild(actions);
                booksList.appendChild(row);
            });
        } else {
            booksList.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Không có sách nào.</td></tr>`;
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

async function submitBook() {
    const formData = new FormData();
    formData.append("title", document.getElementById("bookTitle").value);
    formData.append("author", document.getElementById("bookAuthor").value);
    formData.append("price", document.getElementById("bookPrice").value);
    formData.append("description", document.getElementById("bookDescription").value);
    formData.append("genre", document.getElementById("bookGenre").value);
    formData.append("quality", document.getElementById("bookQuality").value);
    formData.append("thumbnail", document.getElementById("bookThumbnail").files[0]);

    try {
        const response = await fetch('/books', {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            alert("Thêm sách thành công!");
            fetchBooks();
        } else {
            alert("Lỗi: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
    }
}


function editBook(book) {
    document.getElementById('bookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookPrice').value = book.price;
    document.getElementById('bookThumbnail').value = book.thumbnail;
    document.getElementById('bookDescription').value = book.description;
    document.getElementById('bookGenre').value = book.genre;
    document.getElementById('bookQuality').value = book.quality;

    editingBookId = book.id; // Lưu ID sách đang chỉnh sửa
    document.getElementById("saveBookBtn").textContent = "Lưu thay đổi";
}

async function deleteBook(bookId) {
    if (!bookId) {
        alert("ID sách không hợp lệ!");
        return;
    }

    if (confirm(`Bạn có chắc muốn xóa sách có ID: ${bookId}?`)) {
        try {
            const response = await fetch(`/books/${bookId}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                alert("Xóa thành công!");
                fetchBooks();
            } else {
                alert("Xóa thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi xóa sách:", error);
        }
    }
}
