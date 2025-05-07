document.addEventListener('DOMContentLoaded', function () {

    // --- Các hàm xử lý localStorage (Giống các trang trước) ---
    function getCart() { return JSON.parse(localStorage.getItem('cartItems')) || []; }
    function updateCartBadge() { /* ... code giống như các file trước ... */
        const cart = getCart();
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartBadge = document.querySelector('.navbar .badge');
        if (cartBadge) {
            if (totalQuantity > 0) {
                cartBadge.textContent = totalQuantity;
                cartBadge.style.display = 'inline-block';
            } else {
                cartBadge.style.display = 'none';
            }
        }
    }

    // --- Hàm cập nhật giao diện Header dựa trên trạng thái đăng nhập ---
    // --- Hàm cập nhật giao diện Header dựa trên trạng thái đăng nhập ---
    function updateHeaderUI() {
        // Lấy session từ localStorage, nếu không có thì coi như chưa đăng nhập
        const session = JSON.parse(localStorage.getItem('userSession')) || { isLoggedIn: false };
        // Lấy các phần tử HTML cần ẩn/hiện
        const navLoginRegister = document.getElementById('nav-login-register');
        const navUserAccount = document.getElementById('nav-user-account');
        const navUsername = document.getElementById('nav-username');
        const navLogout = document.getElementById('nav-logout');

        // Kiểm tra các phần tử có tồn tại không trước khi thao tác
        if (navLoginRegister && navUserAccount && navUsername && navLogout) {
            if (session.isLoggedIn) {
                // Nếu ĐÃ đăng nhập
                navLoginRegister.style.display = 'none'; // Ẩn nút Đăng nhập/Đăng ký
                navUserAccount.style.display = 'block'; // Hiện dropdown tài khoản
                // Hiển thị tên hoặc email (ưu tiên tên)
                navUsername.textContent = session.name || session.email || 'Người dùng';

                // Gắn sự kiện cho nút đăng xuất (an toàn hơn khi gắn lại mỗi lần kiểm tra)
                navLogout.onclick = function (e) {
                    e.preventDefault(); // Ngăn chuyển trang nếu là link '#'
                    localStorage.removeItem('userSession'); // Xóa session
                    alert('Bạn đã đăng xuất.');
                    updateHeaderUI(); // Cập nhật lại giao diện header ngay lập tức
                    window.location.href = 'index.html'; // Chuyển về trang chủ
                };

            } else {
                // Nếu CHƯA đăng nhập
                navLoginRegister.style.display = 'flex'; // Hiện nút Đăng nhập/Đăng ký (dùng flex hoặc block tùy layout)
                navUserAccount.style.display = 'none'; // Ẩn dropdown tài khoản
            }
        } else {
            console.error("Không tìm thấy một hoặc nhiều phần tử header cần thiết (nav-login-register, nav-user-account, nav-username, nav-logout).");
        }

        // Luôn cập nhật badge giỏ hàng
        updateCartBadge(); // Đảm bảo hàm updateCartBadge() cũng được định nghĩa đúng
    }

    // Gọi hàm này khi trang tải xong (phải có trên mọi trang)
    document.addEventListener('DOMContentLoaded', updateHeaderUI);

    // --- Xử lý Form Đăng ký ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Ngăn form submit theo cách truyền thống

            // Lấy giá trị từ các input
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value; // Không trim pass
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            // --- Validation cơ bản ---
            if (password !== confirmPassword) {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Mật khẩu xác nhận không khớp!' });
                document.getElementById('confirmPassword').focus();
                return; // Dừng xử lý
            }
            if (password.length < 6) {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Mật khẩu phải có ít nhất 6 ký tự!' });
                document.getElementById('registerPassword').focus();
                return;
            }
            if (!agreeTerms) {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật!' });
                return; // Dừng xử lý
            }

            // --- Kiểm tra Email đã tồn tại chưa (trong localStorage) ---
            let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            let emailExists = users.some(user => user.email === email);

            if (emailExists) {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Email này đã được đăng ký. Vui lòng sử dụng email khác.' });
                document.getElementById('registerEmail').focus();
                return; // Dừng xử lý
            }

            // --- Lưu người dùng mới (Mô phỏng - KHÔNG AN TOÀN VỚI MẬT KHẨU THẬT) ---
            const newUser = {
                name: name,
                email: email,
                password: password // !! Cảnh báo: Không bao giờ lưu mật khẩu dạng text thuần trong ứng dụng thật
            };
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            // --- Tự động đăng nhập sau khi đăng ký thành công (Mô phỏng) ---
            const userSession = {
                isLoggedIn: true,
                email: newUser.email,
                name: newUser.name
            };
            localStorage.setItem('userSession', JSON.stringify(userSession));

            // --- Thông báo và chuyển hướng ---
            Swal.fire({
                icon: 'success',
                title: 'Đăng ký thành công!',
                text: 'Tài khoản của bạn đã được tạo. Đang chuyển hướng...',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                willClose: () => {
                    window.location.href = 'index.html';
                }
            }); window.location.href = 'index.html'; // Chuyển về trang chủ
        });
    }

    // --- Cập nhật Header khi trang tải xong ---
    updateHeaderUI(); // Gọi hàm này trên tất cả các trang

});