document.addEventListener('DOMContentLoaded', function () {

    // --- Các hàm xử lý localStorage và badge (Giống các trang trước) ---
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

    // --- Xử lý Form Đăng nhập ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Ngăn form submit

            // Lấy giá trị input
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            // Lấy danh sách người dùng đã đăng ký từ localStorage
            let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

            // Tìm người dùng khớp email VÀ mật khẩu (Mô phỏng - KHÔNG AN TOÀN)
            let foundUser = users.find(user => user.email === email && user.password === password);

            if (foundUser) {
                // --- Đăng nhập thành công ---
                // Tạo session
                const userSession = {
                    isLoggedIn: true,
                    email: foundUser.email,
                    name: foundUser.name // Lấy tên từ user đã đăng ký
                };
                // Lưu session vào localStorage
                localStorage.setItem('userSession', JSON.stringify(userSession));

                // Thông báo và chuyển hướng
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    text: 'Đang chuyển hướng đến trang chủ...',
                    timer: 1500, // Thời gian hiển thị thông báo
                    showConfirmButton: false,
                    allowOutsideClick: false, // Không cho nhấn ra ngoài để tắt
                    didOpen: () => { // Có thể thêm hiệu ứng loading nếu muốn
                        Swal.showLoading();
                    },
                    willClose: () => { // Chuyển hướng sau khi thông báo tắt
                        window.location.href = 'index.html';
                    }
               });                window.location.href = 'index.html'; // Chuyển về trang chủ
            } else {
                // --- Đăng nhập thất bại ---
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
                });            }
        });
    }

    // --- Cập nhật Header khi trang tải xong ---
    updateHeaderUI(); // Gọi hàm này trên tất cả các trang

});