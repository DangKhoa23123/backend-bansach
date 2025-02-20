    // Gọi API để lấy danh sách người dùng
    fetch('http://localhost:3000/api/users')
      .then(response => response.json())
      .then(data => {
        // Kiểm tra nếu dữ liệu là mảng
        if (Array.isArray(data) && data.length > 0) {
          let table = '<table>';
          table += '<thead><tr>';
          // Giả sử đối tượng người dùng có các trường id, name, email
          table += '<th>ID</th><th>Username</th><th>Password</th><th>Email</th><th>Phone</th><th>Chỉnh sửa</th>';
          table += '</tr></thead><tbody>';
          data.forEach(user => {
            table += `<tr>
                        <td>${user._id}</td>
                        <td>${user.username}</td>
                        <td>${user.password}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td></td>
                      </tr>`;
          });
          table += '</tbody></table>';
          document.getElementById('users-container').innerHTML = table;
        } else {
          document.getElementById('users-container').innerHTML = '<p>Không có dữ liệu người dùng.</p>';
        }
      })
      .catch(error => {
        console.error('Lỗi khi tải dữ liệu:', error);
        document.getElementById('users-container').innerHTML = '<p>Đã xảy ra lỗi khi tải dữ liệu.</p>';
      });