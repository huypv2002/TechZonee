// File: js/cart.js (Phiên bản Sửa lỗi + Log chi tiết + Tối ưu UI Update)

document.addEventListener('DOMContentLoaded', function () {
    console.log("[Cart Init] DOM đã tải xong. Bắt đầu thiết lập giỏ hàng..."); // DEBUG

    // --- Lấy các phần tử DOM ---
    const cartItemsBody = document.getElementById('cart-items-body');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTableContainer = document.querySelector('.table-responsive.cart-table');
    const cartSummaryActions = document.getElementById('cart-summary-actions');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartGrandTotalEl = document.getElementById('cart-grand-total');

    // --- Kiểm tra sự tồn tại của các phần tử DOM chính ---
    if (!cartItemsBody || !emptyCartMessage || !cartTableContainer || !cartSummaryActions || !cartSubtotalEl || !cartGrandTotalEl) {
        console.error("LỖI NGHIÊM TRỌNG: Không tìm thấy một hoặc nhiều phần tử HTML cốt lõi của trang giỏ hàng!");
        alert("Đã xảy ra lỗi khi tải giao diện giỏ hàng. Vui lòng thử lại.");
        return; // Dừng thực thi
    }
    console.log("[Cart Init] Đã tìm thấy các phần tử DOM cần thiết."); // DEBUG

    // --- Hàm tiện ích định dạng tiền tệ Việt Nam (Nên có trong common.js) ---
    function formatCurrency(number) {
        const numValue = Number(number);
        if (isNaN(numValue)) { return '0₫'; }
        return numValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    // --- Hàm tính toán và cập nhật tổng tiền ---
    function calculateAndUpdateTotals() {
        console.log("[calculateAndUpdateTotals] Bắt đầu tính tổng..."); // DEBUG
        const cart = getCart(); // Lấy dữ liệu mới nhất
        let subtotal = cart.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return sum + (price * quantity);
        }, 0);
        let shippingCost = 0;
        let grandTotal = subtotal + shippingCost;

        cartSubtotalEl.textContent = formatCurrency(subtotal);
        cartGrandTotalEl.textContent = formatCurrency(grandTotal);
        console.log(`[calculateAndUpdateTotals] Kết quả: Tạm tính=${formatCurrency(subtotal)}, Tổng cộng=${formatCurrency(grandTotal)}`); // DEBUG
    }

    // --- Hàm hiển thị giỏ hàng ---
    function renderCart() {
        const cart = getCart();
        console.log("[renderCart] Bắt đầu render. Dữ liệu localStorage:", JSON.stringify(cart)); // Log dữ liệu gốc

        if (!cartItemsBody || !emptyCartMessage || !cartTableContainer || !cartSummaryActions) { /* ... báo lỗi ... */ return; }

        cartItemsBody.innerHTML = ''; // Xóa nội dung cũ

        if (!Array.isArray(cart) || cart.length === 0) {
            console.log("[renderCart] Giỏ hàng trống.");
            emptyCartMessage.style.display = 'block';
            if (cartTableContainer) cartTableContainer.style.display = 'none';
            if (cartSummaryActions) cartSummaryActions.style.display = 'none';
        } else {
            console.log(`[renderCart] Bắt đầu lặp qua ${cart.length} sản phẩm.`);
            emptyCartMessage.style.display = 'none';
            if (cartTableContainer) cartTableContainer.style.display = 'table'; // Sửa lại thành table nếu cần
            if (cartSummaryActions) cartSummaryActions.style.display = 'flex';

            let renderedCount = 0; // Đếm số dòng thực sự được thêm vào
            cart.forEach((item, index) => {
                console.log(`[renderCart] Đang xử lý item index ${index}:`, item); // Log từng item

                // --- Kiểm tra dữ liệu CỰC KỲ QUAN TRỌNG ---
                if (!item) { console.error(`[renderCart] LỖI: Item tại index ${index} là null hoặc undefined.`); return; }
                if (typeof item.cartId === 'undefined' || item.cartId === null) { console.error(`[renderCart] LỖI: Item index ${index} thiếu cartId!`, item); return; }
                if (typeof item.name === 'undefined' || item.name === null) { console.error(`[renderCart] LỖI: Item index ${index} (cartId: ${item.cartId}) thiếu name!`, item); return; }
                if (typeof item.price === 'undefined' || item.price === null) { console.error(`[renderCart] LỖI: Item index ${index} (cartId: ${item.cartId}) thiếu price!`, item); return; }
                if (typeof item.quantity === 'undefined' || item.quantity === null) { console.error(`[renderCart] LỖI: Item index ${index} (cartId: ${item.cartId}) thiếu quantity!`, item); return; }
                // --- Kết thúc kiểm tra ---

                const itemPrice = Number(item.price) || 0;
                const itemQuantity = Number(item.quantity) || 1; // Mặc định là 1 nếu lỗi
                const itemSubtotal = itemPrice * itemQuantity;
                console.log(`[renderCart] Dữ liệu hợp lệ cho cartId="${item.cartId}". Tạo HTML...`); // DEBUG

                const row = document.createElement('tr');
                row.setAttribute('data-cart-item-id', item.cartId);

                // HTML cho dòng (Giữ nguyên cấu trúc)
                row.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.img || 'https://via.placeholder.com/70x70/EEEEEE/DC3545?text=IMG'}" class="me-3 rounded border" alt="${item.name}">
                            <div>
                                <a href="product-detail.html?id=${item.id || ''}" class="product-name text-dark d-block mb-1">${item.name}</a>
                                <small class="text-muted">
                                    ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `${item.size ? ', ' : ''}Màu: ${item.color}` : ''}
                                </small>
                            </div>
                        </div>
                    </td>
                    <td class="text-end">${formatCurrency(itemPrice)}</td>
                    <td class="text-center">
                         <div class="input-group input-group-sm justify-content-center">
                              <button class="btn btn-outline-secondary btn-decrease" type="button">-</button>
                              <input type="number" class="form-control quantity-input" value="${itemQuantity}" min="1" readonly>
                              <button class="btn btn-outline-secondary btn-increase" type="button">+</button>
                         </div>
                    </td>
                    <td class="text-end fw-bold" data-role="item-subtotal">${formatCurrency(itemSubtotal)}</td>
                    <td class="text-center">
                        <button class="btn btn-outline-danger btn-sm border-0 btn-remove" title="Xóa sản phẩm" data-cart-item-id="${item.cartId}">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                `;
                console.log(`[renderCart] HTML cho dòng cartId="${item.cartId}" đã tạo. Chuẩn bị append...`); // DEBUG
                try {
                    cartItemsBody.appendChild(row); // Thêm dòng vào tbody
                    renderedCount++;
                    console.log(`[renderCart] Đã append dòng cho cartId="${item.cartId}" thành công.`); // DEBUG
                } catch (e) {
                    console.error(`[renderCart] LỖI KHI APPEND dòng cho cartId="${item.cartId}":`, e, row.innerHTML); // DEBUG lỗi append
                }
            });

            // Kiểm tra lại sau khi lặp
            if (renderedCount === 0 && cart.length > 0) {
                console.warn("[renderCart] Giỏ hàng có data nhưng không có dòng nào được render (do lỗi data?). Hiển thị thông báo trống.");
                emptyCartMessage.style.display = 'block';
                cartTableContainer.style.display = 'none';
                cartSummaryActions.style.display = 'none';
            } else if (renderedCount > 0) {
                // Đã render thành công ít nhất 1 dòng
                console.log(`[renderCart] Đã render thành công ${renderedCount} dòng.`);
            }
        }
        calculateAndUpdateTotals();
        if (typeof updateCartBadge === 'function') updateCartBadge();
        console.log("[renderCart] Render hoàn tất.");
    }

    // --- Xử lý sự kiện trên tbody (Event Delegation) ---
    cartItemsBody.addEventListener('click', function (event) {
        const target = event.target;
        console.log("[Cart Click] Target:", target);

        // Tìm thẻ <tr> cha gần nhất để lấy cartItemId
        const tableRow = target.closest('tr');
        if (!tableRow) { console.log("[Cart Click] Click không nằm trong dòng."); return; }

        const cartItemId = tableRow.dataset.cartItemId;
        if (!cartItemId) { console.error("[Cart Click] LỖI: Không tìm thấy data-cart-item-id trên <tr>."); return; }
        console.log(`[Cart Click] Đang xử lý cho cartItemId: "${cartItemId}"`);

        const cart = getCart();
        // Tìm index chính xác bằng cartId đã lấy
        const itemIndex = cart.findIndex(item => item && item.cartId === cartItemId);

        console.log(`[Cart Click] Kết quả findIndex: ${itemIndex}`); // DEBUG

        if (itemIndex === -1) {
            console.error(`[Cart Click] LỖI: Không tìm thấy item với cartId="${cartItemId}"`, cart);
            alert(`Lỗi: Không tìm thấy sản phẩm (ID: ${cartItemId}) trong giỏ.`);
            return;
        }

        const currentItem = cart[itemIndex];
        const currentQuantity = parseInt(currentItem.quantity || 0);
        const currentPrice = parseFloat(currentItem.price || 0);

        // Xác định nút nào được nhấn
        const decreaseButton = target.closest('.btn-decrease');
        const increaseButton = target.closest('.btn-increase');
        const removeButton = target.closest('.btn-remove');

        // -- Xử lý nút giảm --
        if (decreaseButton) {
            console.log("[Cart Click] Nhấn nút Giảm.");
            if (currentQuantity > 1) {
                currentItem.quantity = currentQuantity - 1;
                saveCart(cart); // Lưu thay đổi

                // Cập nhật UI trực tiếp
                const quantityInput = tableRow.querySelector('.quantity-input');
                const itemSubtotalCell = tableRow.querySelector('[data-role="item-subtotal"]');
                if (quantityInput) quantityInput.value = currentItem.quantity;
                if (itemSubtotalCell) itemSubtotalCell.textContent = formatCurrency(currentPrice * currentItem.quantity);
                calculateAndUpdateTotals(); // Tính lại tổng
                console.log("[Cart Click] Đã giảm số lượng.");
            } else {
                // Nếu số lượng là 1, hỏi xóa bằng SweetAlert
                Swal.fire({
                    title: 'Xóa sản phẩm?',
                    text: `"${currentItem.name}" chỉ còn 1 sản phẩm. Bạn có muốn xóa khỏi giỏ hàng không?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Vâng, xóa!',
                    cancelButtonText: 'Không'
                }).then((result) => {
                    if (result.isConfirmed) {
                        cart.splice(itemIndex, 1);
                        saveCart(cart);
                        renderCart(); // Xóa thì render lại
                        // Thông báo đã xóa thành công (tùy chọn)
                        Swal.fire('Đã xóa!', `"${currentItem.name}" đã được xóa khỏi giỏ.`, 'success');
                    }
                });
            }
        }
        // -- Xử lý nút tăng --
        else if (increaseButton) {
            console.log("[Cart Click] Nhấn nút Tăng.");
            currentItem.quantity = currentQuantity + 1;
            saveCart(cart); // Lưu thay đổi

            // Cập nhật UI trực tiếp
            const quantityInput = tableRow.querySelector('.quantity-input');
            const itemSubtotalCell = tableRow.querySelector('[data-role="item-subtotal"]');
            if (quantityInput) quantityInput.value = currentItem.quantity;
            if (itemSubtotalCell) itemSubtotalCell.textContent = formatCurrency(currentPrice * currentItem.quantity);
            calculateAndUpdateTotals(); // Tính lại tổng
            console.log("[Cart Click] Đã tăng số lượng.");
        }
        // -- Xử lý nút xóa --
        else if (removeButton) {
            // Hỏi xác nhận bằng SweetAlert
            Swal.fire({
                title: 'Bạn chắc chắn?',
                text: `Bạn muốn xóa "${currentItem.name}" khỏi giỏ hàng?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Vâng, xóa!',
                cancelButtonText: 'Hủy bỏ'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("[Cart Click] Xác nhận xóa item tại index:", itemIndex);
                    cart.splice(itemIndex, 1);
                    saveCart(cart);
                    renderCart(); // Xóa thì render lại
                    // Thông báo thành công
                    Swal.fire('Đã xóa!', `"${currentItem.name}" đã được xóa khỏi giỏ hàng.`, 'success');
                    console.log("[Cart Click] Đã vẽ lại giỏ hàng sau khi xóa.");
                }
            });
        }
    });

    // --- Hiển thị giỏ hàng và cập nhật header khi trang tải lần đầu ---
    console.log("[Cart Init] Gọi renderCart() và updateHeaderUI() lần đầu..."); // DEBUG
    renderCart();
    // Gọi updateHeaderUI từ common.js (nếu nó được định nghĩa ở đó)
    if (typeof updateHeaderUI === 'function') {
        updateHeaderUI();
    } else {
        // Nếu chưa có common.js thì ít nhất cập nhật badge
        updateCartBadge();
    }

}); // Kết thúc DOMContentLoaded