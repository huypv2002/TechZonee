// --- Hàm lấy giỏ hàng từ localStorage ---
function getCart() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// --- Hàm lưu giỏ hàng vào localStorage ---
function saveCart(cart) {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartBadge(); // Cập nhật badge sau khi lưu
}

// --- Hàm cập nhật số lượng trên icon giỏ hàng ---
function updateCartBadge() {
    const cart = getCart();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelector('.navbar .badge'); // Tìm badge trong navbar

    if (cartBadge) {
        if (totalQuantity > 0) {
            cartBadge.textContent = totalQuantity;
            cartBadge.style.display = 'inline-block'; // Hiện badge
        } else {
            cartBadge.style.display = 'none'; // Ẩn nếu không có hàng
        }
    }
}

// --- Hàm cập nhật giao diện Header dựa trên trạng thái đăng nhập ---
function updateHeaderUI() {
    const session = JSON.parse(localStorage.getItem('userSession')) || { isLoggedIn: false };
    const navLoginRegister = document.getElementById('nav-login-register');
    const navUserAccount = document.getElementById('nav-user-account');
    const navUsername = document.getElementById('nav-username');
    const navLogout = document.getElementById('nav-logout'); // Cần cả nút logout

    // Chỉ thực hiện nếu các element tồn tại
    if (navLoginRegister && navUserAccount && navUsername && navLogout) {
        if (session.isLoggedIn) {
            // Nếu ĐÃ đăng nhập
            navLoginRegister.style.display = 'none'; // Ẩn nút Đăng nhập/Đăng ký
            navUserAccount.style.display = 'block'; // Hiện dropdown tài khoản
            navUsername.textContent = session.name || session.email || 'Người dùng'; // Hiển thị tên hoặc email

            // Gắn sự kiện Đăng xuất (chỉ cần gắn 1 lần khi user dropdown hiển thị)
            // Dùng cờ để tránh gắn nhiều lần nếu hàm được gọi lại
            if (!navLogout.hasAttribute('data-listener-attached')) {
                navLogout.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (!navLogout.hasAttribute('data-listener-attached')) {
                        navLogout.addEventListener('click', function(e) {
                            e.preventDefault();
                            Swal.fire({
                                title: 'Bạn chắc chắn muốn đăng xuất?',
                                text: "Bạn sẽ cần đăng nhập lại để tiếp tục mua sắm.",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#d33', // Màu nút xác nhận (đỏ)
                                cancelButtonColor: '#3085d6', // Màu nút hủy (xanh)
                                confirmButtonText: 'Vâng, đăng xuất!',
                                cancelButtonText: 'Hủy bỏ'
                            }).then((result) => {
                                if (result.isConfirmed) { // Chỉ thực hiện nếu người dùng nhấn "Vâng, đăng xuất!"
                                    localStorage.removeItem('userSession');
                                    // Hiển thị thông báo thành công sau khi đăng xuất
                                    Swal.fire({
                                         title: 'Đã đăng xuất!',
                                         icon: 'success',
                                         timer: 1500,
                                         showConfirmButton: false
                                    }).then(() => {
                                         // Cập nhật header và chuyển hướng sau khi thông báo tắt
                                         updateHeaderUI();
                                         window.location.href = 'index.html';
                                    });
                                }
                            });
                        });
                        navLogout.setAttribute('data-listener-attached', 'true');
                    }
                });
                navLogout.setAttribute('data-listener-attached', 'true'); // Đánh dấu đã gắn listener
            }

        } else {
            // Nếu CHƯA đăng nhập
            navLoginRegister.style.display = 'flex'; // Hiện nút Đăng nhập/Đăng ký
            navUserAccount.style.display = 'none'; // Ẩn dropdown tài khoản
            // Xóa listener đăng xuất nếu có (đề phòng)
            if (navLogout.hasAttribute('data-listener-attached')) {
                // Không thể remove trực tiếp anonymous function, nên cách làm trên với cờ là đủ dùng
                navLogout.removeAttribute('data-listener-attached');
            }
        }
    } else {
        // Ghi log lỗi nếu không tìm thấy element cần thiết
        // console.error("Lỗi: Không tìm thấy các phần tử header cần thiết để cập nhật UI.");
    }

    // Luôn cập nhật badge giỏ hàng khi cập nhật header
    updateCartBadge();
}

// --- Gọi hàm cập nhật Header và Badge khi trang tải xong ---
// Mã này sẽ chạy trên mọi trang nhúng file common.js
document.addEventListener('DOMContentLoaded', function () {
    updateHeaderUI();
    // updateCartBadge(); // Không cần gọi lại vì updateHeaderUI đã gọi rồi
});

// --- Các hàm localStorage và badge (Nên có trong common.js) ---
// Đảm bảo các hàm này được định nghĩa đúng (trong common.js hoặc ở đây)
function getCart() {
    const cartData = localStorage.getItem('cartItems');
    try {
        // Cố gắng parse, nếu lỗi hoặc là null/undefined thì trả về mảng rỗng
        return cartData ? JSON.parse(cartData) : [];
    } catch (e) {
        console.error("Lỗi khi đọc giỏ hàng từ localStorage:", e);
        return []; // Trả về mảng rỗng nếu có lỗi parse
    }
}
function saveCart(cart) {
    if (!Array.isArray(cart)) {
        console.error("Lỗi: Dữ liệu lưu vào giỏ hàng không phải là mảng!", cart);
        return;
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartBadge(); // Cập nhật badge sau khi lưu
}
function updateCartBadge() {
    // Kiểm tra xem hàm getCart có trả về mảng không
    const cart = Array.isArray(getCart()) ? getCart() : [];
    // Tính tổng quantity, đảm bảo item.quantity là số
    const totalQuantity = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const cartBadge = document.querySelector('.navbar .badge');
    if (cartBadge) {
        const countSpan = cartBadge.childNodes[0]; // Lấy phần text node bên trong badge
        if (totalQuantity > 0) {
            if (countSpan) countSpan.nodeValue = totalQuantity + " "; // Cập nhật số, thêm khoảng trắng để tránh dính vào visually-hidden
            cartBadge.style.display = 'inline-block';
        } else {
            if (countSpan) countSpan.nodeValue = "0 ";
            cartBadge.style.display = 'none';
        }
    }
}
// Thêm vào js/cart.js hoặc common.js
function showCheckoutAlert() {
    Swal.fire('Thông báo', 'Chức năng Đặt hàng đang được phát triển!', 'info');
}