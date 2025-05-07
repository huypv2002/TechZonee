document.addEventListener('DOMContentLoaded', function () {
    // --- Hàm lấy giỏ hàng từ localStorage ---
    function getCart() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    }

    // --- Hàm lưu giỏ hàng vào localStorage ---
    function saveCart(cart) {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        updateCartBadge();
    }

    // --- Hàm cập nhật số lượng trên icon giỏ hàng ---
    function updateCartBadge() {
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

    // --- Hàm xử lý thêm vào giỏ hàng ---
    function handleAddToCart(event) {
        const button = event.currentTarget;
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = parseInt(button.dataset.productPrice);
        const productImg = button.dataset.productImg;
        
        const cart = getCart();
        const cartItemId = productId;
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
        
        saveCart(cart);
        
        Swal.fire({
            icon: 'success',
            title: 'Đã thêm vào giỏ!',
            text: `Đã thêm "${productName}" vào giỏ hàng!`,
            timer: 1500,
            showConfirmButton: false
        });
    }

    // --- Gắn sự kiện click cho tất cả các nút có class 'add-to-cart-btn' ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // --- Cập nhật số lượng giỏ hàng khi tải trang ---
    updateCartBadge();

});