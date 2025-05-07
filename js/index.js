document.addEventListener('DOMContentLoaded', function () {
    // --- Hàm lấy giỏ hàng từ localStorage ---
    // Hàm này lấy mảng giỏ hàng đã lưu, nếu chưa có thì trả về mảng rỗng
    function getCart() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    }

    // --- Hàm lưu giỏ hàng vào localStorage ---
    // Hàm này nhận vào một mảng giỏ hàng và lưu nó vào localStorage
    function saveCart(cart) {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        // Cập nhật số lượng trên icon giỏ hàng sau khi lưu
        updateCartBadge();
    }

    // --- Hàm cập nhật số lượng trên icon giỏ hàng ---
    // Hàm này tính tổng số lượng và cập nhật badge trên header
    function updateCartBadge() {
        const cart = getCart();
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0); // Tính tổng quantity của các item
        const cartBadge = document.querySelector('.navbar .badge'); // Tìm phần tử badge

        if (cartBadge) { // Kiểm tra xem badge có tồn tại không
            if (totalQuantity > 0) {
                cartBadge.textContent = totalQuantity; // Gán tổng số lượng
                cartBadge.style.display = 'inline-block'; // Hiển thị badge
            } else {
                cartBadge.style.display = 'none'; // Ẩn badge nếu giỏ rỗng
            }
        }
    }

    // --- Hàm xử lý sự kiện khi nhấn nút "Thêm vào giỏ" ---
    function handleAddToCart(event) {
        // Lấy nút đã được nhấp
        const button = event.currentTarget;

        // Lấy thông tin sản phẩm từ thuộc tính data-* của nút
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = parseInt(button.dataset.productPrice); // Chuyển giá thành số nguyên
        const productImg = button.dataset.productImg;

        // Lấy giỏ hàng hiện tại từ localStorage
        const cart = getCart();
        
        // Tạo cartItemId cho sản phẩm không có option
        const cartItemId = productId;
        
        // Tìm sản phẩm trong giỏ hàng dựa trên cartItemId
        const existingItemIndex = cart.findIndex(item => item.cartId === cartItemId);

        if (existingItemIndex > -1) {
            // Nếu đã có, tăng số lượng
            cart[existingItemIndex].quantity += 1;
        } else {
            // Nếu chưa có, thêm mới
            console.log(`[Add Simple] Thêm mới sản phẩm ID: ${productId}`); // Giữ log này
            cart.push({
                cartId: cartItemId,
                id: productId,
                name: productName,
                price: productPrice,
                img: productImg,
                quantity: 1
            });
        }
        
        // Lưu giỏ hàng
        saveCart(cart);
        
        // Hiển thị thông báo
        Swal.fire({
            icon: 'success',
            title: 'Đã thêm vào giỏ!',
            text: `Đã thêm "${productName}" vào giỏ hàng!`,
            timer: 1500,
            showConfirmButton: false
        });
    }

    // --- Gắn sự kiện 'click' cho tất cả các nút có class 'add-to-cart-btn' ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // --- Cập nhật số lượng trên badge giỏ hàng ngay khi trang tải xong ---
    updateCartBadge();

    // --- Sửa lỗi liên kết sản phẩm ---
    const productLinks = document.querySelectorAll('.card-product a[href="product-detail.html"]');
    productLinks.forEach(link => {
        // Kiểm tra và thêm tham số id nếu chưa có
        if (link.getAttribute('href') === 'product-detail.html') {
            // Tìm nút thêm vào giỏ gần nhất để lấy productId
            const addButton = link.closest('.card-product').querySelector('.add-to-cart-btn');
            if (addButton && addButton.dataset.productId) {
                link.href = `product-detail.html?id=${addButton.dataset.productId}`;
            }
        }
    });
});