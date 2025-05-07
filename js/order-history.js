// File: js/order-history.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("[Order History] DOM Loaded. Initializing..."); // DEBUG

    // --- Hàm tiện ích định dạng tiền tệ (Nên có trong common.js) ---
    function formatCurrency(number) {
        const numValue = Number(number);
        if (isNaN(numValue)) { return '0₫'; }
        return numValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    // --- Lấy các phần tử DOM ---
    const tabPanes = {
        all: document.getElementById('all-content'),
        pending: document.getElementById('pending-content'),
        processing: document.getElementById('processing-content'),
        shipping: document.getElementById('shipping-content'),
        delivered: document.getElementById('delivered-content'),
        cancelled: document.getElementById('cancelled-content')
    };
    const tabButtons = {
         all: document.querySelector('#all-tab .order-count'),
         pending: document.querySelector('#pending-tab .order-count'),
         processing: document.querySelector('#processing-tab .order-count'),
         shipping: document.querySelector('#shipping-tab .order-count'),
         delivered: document.querySelector('#delivered-tab .order-count'),
         cancelled: document.querySelector('#cancelled-tab .order-count')
    };
    const noOrdersHTML = `<div class="no-orders text-center py-5 bg-white border rounded shadow-sm" style="display: block;"> <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393b712b96488590b8f781f.png" alt="Chưa có đơn hàng"> <p class="mt-3">Chưa có đơn hàng trong mục này.</p> </div>`;

    // --- Dữ liệu đơn hàng mẫu (Sử dụng thông tin sản phẩm thực tế hơn) ---
    const sampleOrders = [
        {
            id: 'DH20250501',
            shopName: 'Apple Authorised Reseller',
            status: 'delivered',
            statusText: 'Đã giao thành công',
            statusClass: 'text-success',
            date: '01/05/2025',
            items: [
                { id:'P001', name: 'iPhone 14 Pro 256GB - Chính hãng VN/A', variation: 'Màu: Tím Đậm', quantity: 1, price: 22500000, img: './images/iphone14.webp' },
                { id:'P003', name: 'AirPods Pro 2 (USB-C) - Chính hãng', variation: '', quantity: 1, price: 5490000, img: './images/ipod.webp' }
            ],
            totalAmount: 27990000
        },
        {
            id: 'DH20250503',
            shopName: 'Laptop World',
            status: 'shipping',
            statusText: 'Đang vận chuyển',
            statusClass: 'text-info',
            date: '03/05/2025',
            items: [
                 { id:'P002', name: 'MacBook Air M2 13-inch 8GB/256GB', variation: 'Màu: Space Gray', quantity: 1, price: 27490000, img: './images/laptop.webp' }
            ],
            totalAmount: 27490000
        },
         {
            id: 'DH20250504A',
            shopName: 'Gia Dụng Nhà Xinh',
            status: 'processing',
            statusText: 'Người bán đang chuẩn bị hàng',
            statusClass: 'text-primary',
            date: '04/05/2025',
            items: [
                { id:'P007', name: 'Bàn phím cơ không dây AKKO', variation: 'Switch: Blue', quantity: 1, price: 1480000, img: './images/akko.webp' },
                { id:'P008', name: 'Chuột không dây Logitech MX Master 3S', variation: 'Màu: Đen', quantity: 1, price: 2300000, img: './images/chuot.webp' }
            ],
            totalAmount: 3780000
        },
         {
            id: 'DH20250428',
            shopName: 'Điện Máy ABC',
            status: 'cancelled',
            statusText: 'Đã hủy bởi người mua',
            statusClass: 'text-secondary',
            date: '28/04/2025',
            items: [
                 { id:'P004', name: 'Smart TV OLED Samsung 4K 55 inch QA55S90C', variation: '', quantity: 1, price: 26900000, img: './images/tv.webp' }
            ],
            totalAmount: 0 // Đơn hủy
        },
         {
            id: 'DH20250505',
            shopName: 'Apple Authorised Reseller',
            status: 'delivered', // Thêm đơn đã giao khác
            statusText: 'Đã giao thành công',
            statusClass: 'text-success',
            date: '05/05/2025',
            items: [
                 { id:'P005', name: 'Apple Watch SE 2023 GPS 40mm', variation: 'Màu: Starlight Aluminum', quantity: 1, price: 6390000, img: './images/applewatch.webp' }
            ],
            totalAmount: 6390000
        },
        {
            id: 'DH20250506',
            shopName: 'Marshall Store VN',
            status: 'pending', // Ví dụ đơn chờ xác nhận
            statusText: 'Chờ xác nhận',
            statusClass: 'text-warning',
            date: '06/05/2025',
            items: [
                { id:'P006', name: 'Loa Bluetooth Marshall Willen', variation: 'Màu: Black and Brass', quantity: 1, price: 2790000, img: './images/loa.webp' }
            ],
            totalAmount: 2790000
        }
    ];

    // --- Hàm tạo HTML cho thẻ Card đơn hàng ---
    function createOrderCardHTML(order) {
        let itemsHTML = '';
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="product-item d-flex align-items-center">
                        <img src="${item.img || 'https://via.placeholder.com/70x70/eee/ccc?text=IMG'}" alt="${item.name || ''}" class="product-image">
                        <div class="product-info flex-grow-1">
                            <div class="name mb-1">${item.name || 'N/A'}</div>
                            <div class="variation">${item.variation || ''}</div>
                        </div>
                         <div class="price-info flex-shrink-0">
                             <div class="text-muted">x ${item.quantity || 1}</div>
                             <div>${formatCurrency(item.price)}</div>
                         </div>
                    </div>
                `;
            });
        }

        // Xác định nút bấm dựa trên trạng thái
        let actionButtonsHTML = '';
         const orderId = order.id || 'unknown'; // Lấy ID đơn hàng
        if (order.status === 'delivered') {
            actionButtonsHTML = `<button class="btn btn-sm btn-danger me-2" data-order-id="${orderId}" data-action="buy-again">Mua lại</button> <button class="btn btn-sm btn-outline-danger" data-order-id="${orderId}" data-action="review">Đánh giá</button>`;
        } else if (order.status === 'cancelled') {
             actionButtonsHTML = `<button class="btn btn-sm btn-danger" data-order-id="${orderId}" data-action="buy-again-cancelled">Mua lại</button>`;
        } else if (order.status === 'shipping') {
             actionButtonsHTML = `<button class="btn btn-sm btn-outline-secondary" data-order-id="${orderId}" data-action="track">Xem chi tiết vận chuyển</button>`;
        } else if (order.status === 'processing') {
             actionButtonsHTML = `<button class="btn btn-sm btn-outline-secondary" data-order-id="${orderId}" data-action="view-detail">Xem chi tiết</button>`;
        } else if (order.status === 'pending') {
              actionButtonsHTML = `<button class="btn btn-sm btn-outline-danger" data-order-id="${orderId}" data-action="cancel">Hủy đơn</button>`;
        }

        return `
            <div class="card order-card mb-3" data-order-id="${order.id}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <i class="bi bi-shop me-1"></i>
                        <span class="shop-name">${order.shopName || 'Shop bán hàng'}</span>
                    </div>
                    <div class="order-status ${order.statusClass || 'text-secondary'}">
                         ${order.statusText || order.status || 'Không rõ'}
                    </div>
                </div>
                <div class="card-body p-0">
                    ${itemsHTML}
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                     <div>
                        <span class="total-amount-label">Tổng số tiền:</span>
                        <span class="total-amount ms-2">${formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div>
                        ${actionButtonsHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // --- Hàm render đơn hàng vào các tab ---
    function renderOrders() {
        console.log("[Order History] Rendering orders..."); // DEBUG
        const orders = sampleOrders; // Sử dụng dữ liệu mẫu
        const counts = { all: 0, pending: 0, processing: 0, shipping: 0, delivered: 0, cancelled: 0 };

        // Xóa nội dung cũ trong các tab pane
        for (const key in tabPanes) {
            if (tabPanes[key]) {
                tabPanes[key].innerHTML = ''; // Xóa sạch
            }
             if (tabButtons[key]) {
                 tabButtons[key].textContent = ''; // Xóa số đếm cũ
            }
        }

        // Lặp qua đơn hàng và thêm vào tab
        if (orders && orders.length > 0) {
            orders.forEach(order => {
                if (!order || !order.status) return; // Bỏ qua nếu đơn hàng lỗi hoặc thiếu status

                const orderCardHTML = createOrderCardHTML(order);

                // Thêm vào tab "Tất cả"
                if (tabPanes.all) {
                     tabPanes.all.insertAdjacentHTML('beforeend', orderCardHTML);
                }
                 counts.all++;

                // Thêm vào tab trạng thái cụ thể
                const statusKey = order.status; // pending, processing, shipping, delivered, cancelled
                if (tabPanes[statusKey]) {
                    tabPanes[statusKey].insertAdjacentHTML('beforeend', orderCardHTML);
                    counts[statusKey]++;
                }
            });
        }

        // Cập nhật số đếm và hiển thị thông báo nếu tab trống
         for (const key in tabPanes) {
             if (tabPanes[key]) {
                 if (counts[key] > 0) {
                     // Nếu có đơn hàng, ẩn thông báo (nếu có)
                     const noOrderDiv = tabPanes[key].querySelector('.no-orders');
                     if(noOrderDiv) noOrderDiv.style.display = 'none';
                     // Cập nhật số đếm trên nút tab
                      if (tabButtons[key]) {
                         tabButtons[key].textContent = `(${counts[key]})`;
                      }
                 } else {
                     // Nếu không có đơn hàng, hiển thị thông báo
                     tabPanes[key].innerHTML = noOrdersHTML; // Chèn HTML thông báo vào
                 }
             }
         }
         // Xử lý riêng cho nút "Tất cả" nếu không có đơn nào cả
         if (counts.all === 0 && tabPanes.all) {
              tabPanes.all.innerHTML = noOrdersHTML;
         }
         if(tabButtons.all) { // Cập nhật số đếm tab "Tất cả"
             tabButtons.all.textContent = counts.all > 0 ? `(${counts.all})` : '';
         }

        console.log("[Order History] Render orders complete. Counts:", counts); // DEBUG
    }

    // --- Xử lý sự kiện click trên các nút trong card đơn hàng ---
     const orderHistoryContent = document.getElementById('orderHistoryTabContent');
     if(orderHistoryContent) {
         orderHistoryContent.addEventListener('click', function(event){
             const button = event.target.closest('button[data-action]'); // Tìm nút có data-action
             if (!button) return; // Không phải nút hành động

             const action = button.dataset.action;
             const orderId = button.dataset.orderId;

             console.log(`Action: ${action}, Order ID: ${orderId}`); // DEBUG

             switch (action) {
                 case 'buy-again':
                 case 'buy-again-cancelled':
                      alert(`Chức năng "Mua lại" cho đơn hàng ${orderId} đang được phát triển!`);
                     // Logic: Lấy các sản phẩm trong đơn hàng này và thêm vào giỏ hàng hiện tại
                     break;
                 case 'review':
                     alert(`Chức năng "Đánh giá" cho đơn hàng ${orderId} đang được phát triển!`);
                     // Logic: Chuyển đến trang đánh giá hoặc mở modal
                     break;
                 case 'track':
                 case 'view-detail':
                      alert(`Chức năng "Xem chi tiết" đơn hàng ${orderId} đang được phát triển!`);
                      // Logic: Chuyển đến trang chi tiết đơn hàng hoặc mở modal
                      break;
                  case 'cancel':
                       if(confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId}?`)){
                            alert(`Chức năng "Hủy đơn hàng" ${orderId} đang được phát triển! (Trong thực tế sẽ gọi API)`);
                       }
                       break;
                 default:
                     console.log("Hành động không xác định:", action);
             }
         });
     }

    // --- Render đơn hàng lần đầu ---
    renderOrders();

    // --- Gọi hàm cập nhật header từ common.js ---
    if (typeof updateHeaderUI === 'function') {
        updateHeaderUI();
    } else {
        console.warn("Hàm updateHeaderUI không tồn tại (cần có trong common.js).");
        // Gọi updateCartBadge nếu có để cập nhật số lượng giỏ hàng
        if (typeof updateCartBadge === 'function') updateCartBadge();
    }

}); // Kết thúc DOMContentLoaded