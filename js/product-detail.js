// --- Hàm JavaScript cơ bản cho thumbnail và quantity (Giữ nguyên) ---
function changeImage(element, imageUrl) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageUrl; // Cập nhật ảnh chính
        let thumbnails = document.querySelectorAll('.product-thumbnails img');
        thumbnails.forEach(thumb => thumb.classList.remove('active')); // Xóa active cũ
        if (element) {
            element.classList.add('active'); // Thêm active cho thumbnail được nhấp
        }
    }
}

function changeQuantity(amount) {
    let quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        let currentValue = parseInt(quantityInput.value);
        let newValue = currentValue + amount;
        if (newValue >= 1) { // Đảm bảo số lượng không nhỏ hơn 1
            quantityInput.value = newValue;
        }
    }
}

// --- Hàm tiện ích định dạng tiền tệ (Nên có trong common.js) ---
function formatCurrency(number) {
    if (isNaN(number)) { number = 0; }
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// --- Hàm lấy giỏ hàng từ localStorage (Nên có trong common.js) ---
function getCart() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// --- Hàm lưu giỏ hàng vào localStorage (Nên có trong common.js) ---
function saveCart(cart) {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    // Gọi hàm cập nhật badge từ common.js nếu có, hoặc định nghĩa lại ở đây
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

// --- Hàm cập nhật badge (Nên có trong common.js) ---
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


// --- Bắt đầu xử lý khi trang tải xong ---
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Định nghĩa dữ liệu sản phẩm (Mô phỏng Database/API) ---
    // Dùng các ID nhất quán với trang products.html (P001-P012)
    const productDatabase = {
        "P001": {
            name: "iPhone 14 Pro 256GB - Chính hãng VN/A",
            price: 22500000,
            originalPrice: 25990000, // Giá gốc ví dụ
            discountPercent: Math.round(((25990000 - 22500000) / 25990000) * 100), // Tính % giảm
            images: [
                "./images/iphone14.webp", // Ảnh chính
                "./images/iphone14-2.jpg", // Ảnh phụ 1 (thay bằng ảnh thật)
                "./images/iphone14-3.jpg", // Ảnh phụ 2
                "./images/iphone14-4.jpg"  // Ảnh phụ 3
            ],
            shortDescription: "Chip A16 Bionic cực mạnh, camera Pro 48MP đột phá, màn hình Super Retina XDR với Dynamic Island.",
            description: "<p>Trải nghiệm iPhone đỉnh cao với <strong>iPhone 14 Pro</strong>. Chip A16 Bionic siêu nhanh mang lại hiệu năng đồ họa và xử lý AI vượt trội...</p><ul><li>Màn hình ProMotion 120Hz</li><li>Dynamic Island tiện lợi</li><li>Camera chính 48MP chụp ảnh thiếu sáng ấn tượng</li></ul>",
            specs: [
                { name: "Màn hình", value: "Super Retina XDR 6.1 inch, ProMotion" },
                { name: "Chip", value: "A16 Bionic" },
                { name: "Camera sau", value: "Chính 48MP, Ultra Wide 12MP, Telephoto 12MP" },
                { name: "Camera trước", value: "12MP TrueDepth" },
                { name: "Bộ nhớ trong", value: "256GB" }
            ],
            rating: 4.8, // Ví dụ rating
            reviewCount: 150, // Ví dụ số lượt đánh giá
            options: { // Ví dụ có nhiều màu
                color: ["Tím Đậm", "Vàng", "Bạc", "Đen"]
            }
        },
        "P002": {
            name: "MacBook Air M2 13-inch 8GB/256GB",
            price: 27490000,
            originalPrice: 29990000,
            discountPercent: Math.round(((29990000 - 27490000) / 29990000) * 100),
            images: ["./images/laptop.webp", "./images/laptop-2.jpg", "./images/laptop-3.jpg"],
            shortDescription: "Thiết kế mới siêu mỏng nhẹ, chip M2 mạnh mẽ, thời lượng pin cả ngày.",
            description: "<p>MacBook Air M2 là sự lựa chọn hoàn hảo cho công việc và giải trí di động. Với thiết kế mới siêu mỏng nhẹ và chip M2 mạnh mẽ, MacBook Air mang đến hiệu năng vượt trội trong một thân máy tinh tế.</p><ul><li>Chip Apple M2 với hiệu năng CPU và GPU nhanh hơn</li><li>Thời lượng pin lên đến 18 giờ</li><li>Màn hình Liquid Retina sắc nét, sáng hơn</li><li>Thiết kế mỏng nhẹ chỉ 1.24kg</li></ul>",
            specs: [
                { name: "Chip", value: "Apple M2 8 nhân CPU, 8 nhân GPU" },
                { name: "RAM", value: "8GB" },
                { name: "Ổ cứng", value: "256GB SSD" },
                { name: "Màn hình", value: "13.6 inch Liquid Retina" },
                { name: "Màu sắc", value: "Xám Không Gian (Space Gray)" },
                { name: "Cổng kết nối", value: "2 cổng Thunderbolt/USB 4, Jack tai nghe" },
                { name: "Hệ điều hành", value: "macOS Ventura" }
            ],
            rating: 4.9,
            reviewCount: 95,
            options: {
                color: ["Xám Không Gian", "Bạc", "Midnight", "Starlight"]
            }
        },
        "P003": {
            name: "AirPods Pro 2 (USB-C) - Chính hãng",
            price: 5490000,
            originalPrice: 6190000,
            discountPercent: Math.round(((6190000 - 5490000) / 6190000) * 100),
            images: ["./images/ipod.webp", "./images/airpods-pro2-case.jpg"],
            shortDescription: "Chống ồn chủ động gấp 2 lần, Âm thanh không gian cá nhân hóa, hộp sạc USB-C.",
            description: "<p>AirPods Pro thế hệ 2 nâng cấp trải nghiệm âm thanh không dây với khả năng chống ồn chủ động mạnh mẽ, âm thanh không gian cá nhân hóa và thời lượng pin dài hơn.</p><ul><li>Chống ồn chủ động mạnh gấp 2 lần thế hệ đầu</li><li>Chế độ Âm thanh xuyên thấu giúp nghe rõ môi trường xung quanh</li><li>Âm thanh không gian cá nhân hóa với Dolby Atmos</li><li>Thời lượng pin lên đến 6 giờ (30 giờ với hộp sạc)</li></ul>",
            specs: [
                { name: "Chống ồn", value: "Chủ động (ANC)" },
                { name: "Chip", value: "H2" },
                { name: "Thời lượng pin (tai nghe)", value: "Lên đến 6 giờ" },
                { name: "Cổng sạc", value: "USB-C" },
                { name: "Chống nước", value: "IPX4" },
                { name: "Tương thích", value: "iOS, iPadOS, macOS, watchOS" }
            ],
            rating: 4.7,
            reviewCount: 210
        },
        "P004": {
            name: "Smart TV OLED Samsung 4K 55 inch QA55S90C",
            price: 26900000,
            originalPrice: 35900000,
            discountPercent: Math.round(((35900000 - 26900000) / 35900000) * 100),
            images: ["./images/tv.webp", "./images/tv-2.jpg", "./images/tv-3.jpg"],
            shortDescription: "Màu sắc OLED rực rỡ, độ tương phản vô hạn, thiết kế LaserSlim siêu mỏng.",
            description: "<p>Đắm chìm trong thế giới giải trí đỉnh cao với TV OLED Samsung S90C. Công nghệ OLED hiện đại kết hợp với bộ xử lý Neural Quantum 4K mang đến hình ảnh sống động, màu sắc rực rỡ và độ tương phản vô hạn.</p><ul><li>Tấm nền OLED với độ tương phản vô hạn</li><li>Công nghệ Quantum HDR OLED nâng cao dải sáng</li><li>Bộ xử lý Neural Quantum 4K với AI</li><li>Object Tracking Sound Lite với âm thanh theo chuyển động</li></ul>",
            specs: [
                { name: "Loại TV", value: "OLED" },
                { name: "Kích thước", value: "55 inch" },
                { name: "Độ phân giải", value: "4K Ultra HD (3840 x 2160)" },
                { name: "Tần số quét", value: "120Hz" },
                { name: "Hệ điều hành", value: "Tizen™" },
                { name: "Công nghệ hình ảnh", value: "Neural Quantum Processor 4K, Quantum HDR OLED" },
                { name: "Công nghệ âm thanh", value: "Object Tracking Sound Lite, Q-Symphony" },
                { name: "Kết nối", value: "HDMI x4, USB x2, Bluetooth, Wi-Fi" }
            ],
            rating: 4.9,
            reviewCount: 78
        },
        "P005": { 
            name: "Apple Watch SE 2023 GPS 40mm", 
            price: 6390000, 
            originalPrice: 7200000,
            discountPercent: Math.round(((7200000 - 6390000) / 7200000) * 100),
            images: ["./images/applewatch.webp", 
                    "https://cdn.tgdd.vn/Products/Images/7077/289804/apple-watch-se-2022-44mm-vien-nhom-day-silicone-den-2.jpg", 
                    "https://cdn.tgdd.vn/Products/Images/7077/289804/apple-watch-se-2022-44mm-vien-nhom-day-silicone-den-3.jpg"],
            shortDescription: "Theo dõi sức khỏe, thể dục, an toàn với giá hợp lý.", 
            description: "<p>Apple Watch SE 2023 mang đến đầy đủ tính năng cốt lõi của Apple Watch với mức giá hợp lý hơn. Với thiết kế sang trọng và các tính năng theo dõi sức khỏe, thể dục và an toàn, Apple Watch SE là lựa chọn hoàn hảo cho người dùng lần đầu.</p><ul><li>Chip S8 SiP mạnh mẽ</li><li>Phát hiện va chạm và tính năng SOS khẩn cấp</li><li>Theo dõi nhịp tim, giấc ngủ và mức độ oxy trong máu</li><li>Kháng nước đến 50m</li></ul>",
            specs: [
                { name: "Kích thước màn hình", value: "40mm" },
                { name: "Chip", value: "S8 SiP" },
                { name: "Bộ nhớ", value: "32GB" },
                { name: "Kết nối", value: "GPS, Bluetooth 5.3, Wi-Fi" },
                { name: "Pin", value: "Lên đến 18 giờ" },
                { name: "Chống nước", value: "50m (ISO 22810:2010)" },
                { name: "Cảm biến", value: "Nhịp tim quang học, Gia tốc, La bàn, Con quay hồi chuyển" }
            ],
            rating: 4.5, 
            reviewCount: 112,
            options: {
                color: ["Starlight", "Midnight", "Bạc"]
            }
        },
        "P006": { 
            name: "Loa Bluetooth Marshall Willen", 
            price: 2790000, 
            originalPrice: 3190000,
            discountPercent: Math.round(((3190000 - 2790000) / 3190000) * 100),
            images: ["./images/loa.webp",
                    "https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/11/26/638051260762231852_marshall-willen-den-2.jpg",
                    "https://images.fpt.shop/unsafe/fit-in/214x214/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/11/26/638051260761013089_marshall-willen-den-3.jpg"],
            shortDescription: "Thiết kế cổ điển, âm thanh mạnh mẽ, nhỏ gọn dễ mang theo.", 
            description: "<p>Marshall Willen là loa Bluetooth nhỏ gọn nhất của Marshall, mang đến âm thanh mạnh mẽ trong một thiết kế nhỏ gọn và linh hoạt. Với thời lượng pin lên đến 15 giờ, loa Marshall Willen là người bạn đồng hành lý tưởng cho mọi cuộc phiêu lưu.</p><ul><li>Âm thanh rõ ràng với âm bass mạnh mẽ</li><li>Thời lượng pin 15 giờ</li><li>Chống nước và bụi IP67</li><li>Dây đeo linh hoạt, dễ dàng gắn vào ba lô hoặc xe đạp</li></ul>",
            specs: [
                { name: "Công suất", value: "10W" },
                { name: "Thời lượng pin", value: "15 giờ" },
                { name: "Chuẩn chống nước", value: "IP67" },
                { name: "Kết nối", value: "Bluetooth 5.1" },
                { name: "Kích thước", value: "101.6 x 100.5 x 40.4 mm" },
                { name: "Trọng lượng", value: "310g" }
            ],
            rating: 4.6, 
            reviewCount: 80,
            options: {
                color: ["Black and Brass", "Cream"]
            }
        },
        "P007": { 
            name: "Bàn phím cơ không dây AKKO", 
            price: 1480000, 
            originalPrice: 1790000,
            discountPercent: Math.round(((1790000 - 1480000) / 1790000) * 100),
            images: ["./images/akko.webp",
                    "https://akkogear.com.vn/wp-content/uploads/2023/04/3098B-Multi-modes-Black-Gold-05.jpg",
                    "https://akkogear.com.vn/wp-content/uploads/2023/04/3098B-Multi-modes-Black-Gold-03.jpg"],
            shortDescription: "Gõ phím êm ái, kết nối đa dạng, thiết kế tinh tế.", 
            description: "<p>Bàn phím cơ AKKO mang đến trải nghiệm gõ phím tuyệt vời với thiết kế nhỏ gọn 75% và kết nối đa dạng. Với các switch chất lượng cao và keycap PBT Double-shot, đây là sự lựa chọn lý tưởng cho cả làm việc và chơi game.</p><ul><li>Kết nối đa dạng: có dây, Bluetooth 5.0, Wireless 2.4GHz</li><li>Switch AKKO CS chất lượng cao với độ bền 50 triệu lần nhấn</li><li>Keycap PBT Double-shot bền bỉ, không bị mờ chữ</li><li>LED RGB với nhiều chế độ đèn khác nhau</li></ul>",
            specs: [
                { name: "Kiểu", value: "75%" },
                { name: "Switch", value: "AKKO CS Jelly (Linear/Tactile)" },
                { name: "Kết nối", value: "Bluetooth 5.0, Wireless 2.4GHz, Type-C" },
                { name: "Keycap", value: "PBT Double-shot" },
                { name: "Pin", value: "3000mAh, sử dụng đến 300 giờ" },
                { name: "Đèn", value: "RGB đơn LED" }
            ],
            rating: 4.8, 
            reviewCount: 120,
            options: {
                color: ["Black Gold", "Midnight", "Cream Yellow"],
                switch: ["Blue", "Red", "Brown"]
            }
        },
        "P008": { 
            name: "Chuột không dây Logitech MX Master 3S", 
            price: 2300000, 
            originalPrice: 2790000,
            discountPercent: Math.round(((2790000 - 2300000) / 2790000) * 100),
            images: ["./images/chuot.webp",
                    "https://resource.logitech.com/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-top-view-graphite.png",
                    "https://resource.logitech.com/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-side-view-graphite.png"],
            shortDescription: "Thiết kế công thái học, cuộn MagSpeed siêu nhanh.", 
            description: "<p>Logitech MX Master 3S là chuột không dây cao cấp với thiết kế công thái học, cảm biến 8K DPI và công nghệ cuộn MagSpeed. Được thiết kế cho hiệu suất và thoải mái tối đa, MX Master 3S là công cụ hoàn hảo cho các chuyên gia sáng tạo và người dùng đòi hỏi cao.</p><ul><li>Cảm biến chính xác 8K DPI, hoạt động trên mọi bề mặt, kể cả kính</li><li>Công nghệ cuộn MagSpeed siêu nhanh</li><li>Nút click tĩnh lặng, giảm 90% tiếng ồn</li><li>Tùy chỉnh nâng cao với Logitech Options+</li></ul>",
            specs: [
                { name: "Cảm biến", value: "8K DPI" },
                { name: "Kết nối", value: "Bluetooth, Logitech Bolt" },
                { name: "Nút", value: "7 nút có thể tùy chỉnh" },
                { name: "Pin", value: "Sạc USB-C, sử dụng đến 70 ngày" },
                { name: "Tương thích", value: "Windows, macOS, Linux, iPadOS" },
                { name: "Trọng lượng", value: "141g" }
            ],
            rating: 4.9, 
            reviewCount: 150,
            options: {
                color: ["Đen", "Xám", "Trắng"]
            }
        },
        "P009": {
            name: "iPad Pro M2 11-inch WiFi 128GB",
            price: 19990000,
            originalPrice: 22990000,
            discountPercent: Math.round(((22990000 - 19990000) / 22990000) * 100),
            images: [
                "https://cdn.tgdd.vn/Products/Images/522/274155/ipad-pro-m2-11-wifi-xam-thumb-600x600.jpg",
                "https://cdn.tgdd.vn/Products/Images/522/274155/Slider/vi-vn-ipad-pro-m2-11-inch-wifi-slide-20.jpg",
                "https://cdn.tgdd.vn/Products/Images/522/274155/Slider/vi-vn-ipad-pro-m2-11-inch-wifi-slide-15.jpg"
            ],
            shortDescription: "Hiệu năng đột phá với chip M2, màn hình Liquid Retina sắc nét, Apple Pencil hover.",
            description: "<p>iPad Pro M2 mang đến sức mạnh chuyên nghiệp với chip M2 tiên tiến, màn hình Liquid Retina ProMotion và các tính năng mới như Apple Pencil hover. Đây là công cụ mạnh mẽ nhất của Apple cho sáng tạo, làm việc và giải trí.</p><ul><li>Chip M2 với CPU 8 lõi và GPU 10 lõi mạnh mẽ</li><li>Màn hình Liquid Retina 11-inch với ProMotion và True Tone</li><li>Hệ thống camera sau kép với máy quét LiDAR</li><li>Hỗ trợ Apple Pencil (thế hệ 2) với chức năng hover</li></ul>",
            specs: [
                { name: "Chip", value: "Apple M2" },
                { name: "Màn hình", value: "11 inch Liquid Retina, ProMotion 120Hz" },
                { name: "RAM", value: "8GB" },
                { name: "Bộ nhớ trong", value: "128GB" },
                { name: "Camera sau", value: "12MP Wide, 10MP Ultra Wide, LiDAR Scanner" },
                { name: "Camera trước", value: "12MP Ultra Wide với Center Stage" },
                { name: "Pin", value: "Lên đến 10 giờ duyệt web" },
                { name: "Kết nối", value: "Wi-Fi 6E, Bluetooth 5.3, USB-C (Thunderbolt 4)" }
            ],
            rating: 4.9,
            reviewCount: 88,
            options: {
                color: ["Xám Không Gian", "Bạc"]
            }
        },
        "P010": {
            name: "Samsung Galaxy S23 Ultra 5G 256GB",
            price: 23990000,
            originalPrice: 31990000,
            discountPercent: Math.round(((31990000 - 23990000) / 31990000) * 100),
            images: [
                "https://cdn.tgdd.vn/Products/Images/42/249948/samsung-galaxy-s23-ultra-thumb-xanh-600x600.jpg",
                "https://cdn.tgdd.vn/Products/Images/42/249948/Slider/vi-vn-samsung-galaxy-s23-ultra-slider-4.jpg",
                "https://cdn.tgdd.vn/Products/Images/42/249948/Slider/vi-vn-samsung-galaxy-s23-ultra-slider-5.jpg"
            ],
            shortDescription: "Camera 200MP, S Pen tích hợp, màn hình Dynamic AMOLED 2X sắc nét.",
            description: "<p>Galaxy S23 Ultra là chiếc smartphone cao cấp nhất của Samsung với camera 200MP đột phá, hiệu năng mạnh mẽ với Snapdragon 8 Gen 2 và bút S Pen tích hợp. Thiết kế cao cấp từ kính và kim loại với màn hình cong tinh tế mang đến trải nghiệm flagship đỉnh cao.</p><ul><li>Camera chính 200MP cho chất lượng ảnh đột phá</li><li>Snapdragon 8 Gen 2 for Galaxy mạnh mẽ</li><li>S Pen tích hợp với độ trễ thấp</li><li>Màn hình Dynamic AMOLED 2X với độ sáng cao</li></ul>",
            specs: [
                { name: "Màn hình", value: "6.8 inch, Dynamic AMOLED 2X, 120Hz" },
                { name: "Chip", value: "Snapdragon 8 Gen 2 for Galaxy" },
                { name: "RAM", value: "8GB" },
                { name: "Bộ nhớ trong", value: "256GB" },
                { name: "Camera sau", value: "Chính 200MP, Ultra Wide 12MP, Tele 10MP (3x), Tele 10MP (10x)" },
                { name: "Camera trước", value: "12MP" },
                { name: "Pin", value: "5000mAh, sạc nhanh 45W" },
                { name: "Bút S Pen", value: "Tích hợp, độ trễ 2.8ms" }
            ],
            rating: 4.8,
            reviewCount: 145,
            options: {
                color: ["Xanh", "Đen", "Kem", "Tím"]
            }
        },
        "P011": {
            name: "Tai nghe chụp tai Sony WH-1000XM5",
            price: 8290000,
            originalPrice: 9490000,
            discountPercent: Math.round(((9490000 - 8290000) / 9490000) * 100),
            images: [
                "https://cdn.tgdd.vn/Products/Images/54/253802/tai-nghe-bluetooth-sony-wh-1000xm5-thumb-600x600.jpeg",
                "https://cdn.tgdd.vn/Products/Images/54/253802/Slider/638328076439752669_tai-nghe-bluetooth-sony-wh-1000xm5-slider-3.jpg",
                "https://cdn.tgdd.vn/Products/Images/54/253802/Slider/638328076437883907_tai-nghe-bluetooth-sony-wh-1000xm5-slider-4.jpg"
            ],
            shortDescription: "Chống ồn hàng đầu, chip V1 mới, 8 microphone và 30 giờ pin.",
            description: "<p>Sony WH-1000XM5 mang đến trải nghiệm âm thanh và chống ồn đỉnh cao với thiết kế mới tinh tế hơn và công nghệ xử lý âm thanh tiên tiến. Tám microphone và hai bộ xử lý tạo ra khả năng chống ồn tốt nhất trong ngành, cùng với âm thanh Hi-Res sống động.</p><ul><li>Chống ồn thế hệ mới với chip V1 và QN1</li><li>8 microphone và AI độc quyền của Sony</li><li>Âm thanh Hi-Res với LDAC và DSEE Extreme</li><li>Pin 30 giờ, sạc nhanh 3 phút dùng 3 giờ</li></ul>",
            specs: [
                { name: "Kết nối", value: "Bluetooth 5.2, NFC, Jack 3.5mm" },
                { name: "Codec", value: "LDAC, AAC, SBC" },
                { name: "Thời lượng pin", value: "30 giờ (với ANC), 40 giờ (không ANC)" },
                { name: "Chống ồn", value: "Công nghệ chống ồn thích ứng" },
                { name: "Microphone", value: "8 mic với Precise Voice Pickup" },
                { name: "Điều khiển", value: "Cảm ứng, nút vật lý, giọng nói" },
                { name: "Khối lượng", value: "250g" }
            ],
            rating: 4.9,
            reviewCount: 110,
            options: {
                color: ["Đen", "Bạc"]
            }
        },
        "P012": {
            name: "Xiaomi TV A Pro 55 inch 4K",
            price: 9990000,
            originalPrice: 12990000,
            discountPercent: Math.round(((12990000 - 9990000) / 12990000) * 100),
            images: [
                "https://cdn.tgdd.vn/Products/Images/1942/303044/xiaomi-tv-a-l55m8-p-2-600x600.jpg",
                "https://cdn.tgdd.vn/Products/Images/1942/303044/Slider/xiaomi-tv-a-l55m8-p-slider-1.jpg",
                "https://cdn.tgdd.vn/Products/Images/1942/303044/Slider/xiaomi-tv-a-l55m8-p-slider-2.jpg"
            ],
            shortDescription: "Hình ảnh 4K sắc nét, Dolby Vision, âm thanh Dolby Audio và DTS-HD.",
            description: "<p>Xiaomi TV A Pro 55 inch mang đến trải nghiệm giải trí đỉnh cao với màn hình 4K UHD, công nghệ Dolby Vision và HDR10+. Hệ điều hành Google TV thông minh với hàng ngàn ứng dụng và điều khiển bằng giọng nói giúp bạn dễ dàng tìm kiếm nội dung yêu thích.</p><ul><li>Màn hình 4K UHD với công nghệ MEMC mượt mà</li><li>Hỗ trợ Dolby Vision, HDR10+ cho hình ảnh sống động</li><li>Âm thanh Dolby Audio và DTS-HD sống động</li><li>Google TV với các ứng dụng Netflix, YouTube, Amazon Prime...</li></ul>",
            specs: [
                { name: "Loại màn hình", value: "LED 4K UHD" },
                { name: "Độ phân giải", value: "3840 x 2160 pixels" },
                { name: "Công nghệ hình ảnh", value: "Dolby Vision, HDR10+, MEMC" },
                { name: "Công nghệ âm thanh", value: "Dolby Audio, DTS-HD, 30W" },
                { name: "Hệ điều hành", value: "Google TV" },
                { name: "Kết nối", value: "HDMI x3, USB x2, Bluetooth 5.0, Wi-Fi" },
                { name: "Công suất loa", value: "2 x 15W" },
                { name: "Điều khiển", value: "Điều khiển thông minh có mic, Google Assistant" }
            ],
            rating: 4.6,
            reviewCount: 95
        }
    };

    // --- 2. Lấy ID sản phẩm từ URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Ví dụ: lấy 'P001' từ ?id=P001

    // --- 3. Tìm sản phẩm trong "database" ---
    const product = productId ? productDatabase[productId] : null;

    // --- 4. Lấy các phần tử HTML cần cập nhật ---
    const productNameEl = document.getElementById('product-name');
    const mainProductImageEl = document.getElementById('mainProductImage');
    const productThumbnailsEl = document.getElementById('product-thumbnails');
    const productRatingEl = document.getElementById('product-rating');
    const productReviewCountEl = document.getElementById('product-review-count');
    const productShortDescriptionEl = document.getElementById('product-short-description');
    const productPriceEl = document.getElementById('product-price');
    const productOriginalPriceEl = document.getElementById('product-original-price');
    const productDiscountBadgeEl = document.getElementById('product-discount-badge');
    const productSizeSelect = document.getElementById('productSize');
    const productColorSelect = document.getElementById('productColor');
    const productOptionsContainer = document.getElementById('product-options-container'); // Div chứa options
    const detailAddToCartBtn = document.getElementById('detail-add-to-cart-btn');
    const descriptionContentEl = document.getElementById('description-content');
    const specsTbodyEl = document.getElementById('specs-tbody');
    const reviewsContentEl = document.getElementById('reviews-content'); // Có thể cập nhật sau
    const productNotFoundEl = document.getElementById('product-not-found');
    const productContentRow = document.getElementById('product-content-row'); // Row chính chứa nội dung

    // --- 5. Cập nhật nội dung trang ---
    if (product && productContentRow) {
        productContentRow.style.display = 'flex'; // Hiện nội dung nếu tìm thấy SP
        productNotFoundEl.style.display = 'none'; // Ẩn thông báo lỗi

        // Cập nhật tiêu đề trang
        document.title = `${product.name} - Shop Bán Hàng`;

        // Cập nhật thông tin cơ bản
        if (productNameEl) productNameEl.textContent = product.name;
        if (productShortDescriptionEl) productShortDescriptionEl.textContent = product.shortDescription;
        if (productPriceEl) productPriceEl.textContent = formatCurrency(product.price);

        // Xử lý giá gốc và % giảm giá
        if (product.originalPrice && product.originalPrice > product.price && productOriginalPriceEl) {
            productOriginalPriceEl.textContent = formatCurrency(product.originalPrice);
            productOriginalPriceEl.style.display = 'inline'; // Hiện giá gốc
        } else if (productOriginalPriceEl) {
            productOriginalPriceEl.style.display = 'none'; // Ẩn nếu không có
        }
        if (product.discountPercent && productDiscountBadgeEl) {
            productDiscountBadgeEl.textContent = `-${product.discountPercent}%`;
            productDiscountBadgeEl.style.display = 'inline-block'; // Hiện badge
        } else if (productDiscountBadgeEl) {
            productDiscountBadgeEl.style.display = 'none'; // Ẩn nếu không có
        }

        // Cập nhật ảnh chính và thumbnails
        if (mainProductImageEl && product.images && product.images.length > 0) {
            mainProductImageEl.src = product.images[0]; // Ảnh đầu tiên là ảnh chính
            mainProductImageEl.alt = product.name;
        }
        if (productThumbnailsEl && product.images && product.images.length > 1) {
            productThumbnailsEl.innerHTML = ''; // Xóa thumbnail cũ (nếu có)
            product.images.forEach((imgUrl, index) => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = `Thumbnail ${index + 1}`;
                // Gán sự kiện onclick để đổi ảnh chính
                img.onclick = function () { changeImage(this, imgUrl); };
                if (index === 0) {
                    img.classList.add('active'); // Đặt active cho ảnh đầu tiên
                }
                productThumbnailsEl.appendChild(img);
            });
        } else if (productThumbnailsEl) {
            productThumbnailsEl.innerHTML = ''; // Xóa thumbnail nếu chỉ có 1 ảnh
        }

        // Cập nhật options (Size, Color) - Ẩn/hiện và điền lựa chọn
        let hasOptions = false;
        if (product.options?.size && productSizeSelect) {
            productSizeSelect.innerHTML = '<option selected value="">Chọn kích thước</option>'; // Reset
            product.options.size.forEach(size => {
                productSizeSelect.innerHTML += `<option value="${size}">${size}</option>`;
            });
            productSizeSelect.disabled = false;
            productSizeSelect.closest('.col-md-6').style.display = 'block'; // Hiện cột size
            hasOptions = true;
        } else if (productSizeSelect) {
            productSizeSelect.closest('.col-md-6').style.display = 'none'; // Ẩn cột size nếu SP không có
        }

        if (product.options?.color && productColorSelect) {
            productColorSelect.innerHTML = '<option selected value="">Chọn màu sắc</option>'; // Reset
            product.options.color.forEach(color => {
                productColorSelect.innerHTML += `<option value="${color}">${color}</option>`;
            });
            productColorSelect.disabled = false;
            productColorSelect.closest('.col-md-6').style.display = 'block'; // Hiện cột color
            hasOptions = true;
        } else if (productColorSelect) {
            productColorSelect.closest('.col-md-6').style.display = 'none'; // Ẩn cột color nếu SP không có
        }
        // Ẩn cả dòng options nếu không có tùy chọn nào
        if (productOptionsContainer) {
            productOptionsContainer.style.display = hasOptions ? 'flex' : 'none';
        }


        // Cập nhật nút Add to Cart với đúng data
        if (detailAddToCartBtn) {
            detailAddToCartBtn.dataset.productId = productId; // Gán ID lấy từ URL
            detailAddToCartBtn.dataset.productName = product.name;
            detailAddToCartBtn.dataset.productPrice = product.price; // Giá hiện tại
            detailAddToCartBtn.dataset.productImg = (product.images && product.images.length > 0) ? product.images[0] : ''; // Ảnh đại diện
            detailAddToCartBtn.disabled = false; // Bật nút
        }

        // Cập nhật Tabs
        if (descriptionContentEl) descriptionContentEl.innerHTML = product.description || '<p>Chưa có mô tả chi tiết cho sản phẩm này.</p>';
        if (specsTbodyEl && product.specs && product.specs.length > 0) {
            specsTbodyEl.innerHTML = ''; // Xóa nội dung cũ
            product.specs.forEach(spec => {
                specsTbodyEl.innerHTML += `<tr><th scope="row" style="width: 30%;">${spec.name}</th><td>${spec.value}</td></tr>`;
            });
        } else if (specsTbodyEl) {
            specsTbodyEl.innerHTML = '<tr><td>Chưa có thông số kỹ thuật.</td></tr>';
        }
        // Có thể thêm logic tải và hiển thị đánh giá ở đây nếu muốn

        // Cập nhật Rating (ví dụ)
        if (productRatingEl && product.rating) {
            // Tạo chuỗi sao dựa trên rating
            let starsHTML = '';
            let fullStars = Math.floor(product.rating);
            let halfStar = (product.rating % 1 >= 0.5) ? 1 : 0;
            let emptyStars = 5 - fullStars - halfStar;
            for (let i = 0; i < fullStars; i++) starsHTML += '<i class="bi bi-star-fill"></i>';
            if (halfStar) starsHTML += '<i class="bi bi-star-half"></i>';
            for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="bi bi-star"></i>';
            productRatingEl.innerHTML = starsHTML;
        } else if (productRatingEl) {
            productRatingEl.innerHTML = ''; // Xóa nếu không có rating
        }
        if (productReviewCountEl && product.reviewCount) {
            productReviewCountEl.textContent = `(${product.reviewCount} đánh giá)`;
        } else if (productReviewCountEl) {
            productReviewCountEl.textContent = '(Chưa có đánh giá)';
        }


    } else {
        // --- Nếu không tìm thấy sản phẩm ---
        console.error("Không tìm thấy sản phẩm với ID:", productId);
        if (productContentRow) productContentRow.style.display = 'none'; // Ẩn nội dung chính
        if (productNotFoundEl) productNotFoundEl.style.display = 'block'; // Hiện thông báo lỗi
        if (productNameEl) productNameEl.textContent = "Không tìm thấy sản phẩm";
        document.title = "Không tìm thấy sản phẩm - Shop Bán Hàng";
    }


    // --- Xử lý nút THÊM VÀO GIỎ ở trang chi tiết (logic đã có từ file HTML trước) ---
    if (detailAddToCartBtn) {
        detailAddToCartBtn.addEventListener('click', function () {
            const productId = this.dataset.productId;
            // Kiểm tra lại xem productId có hợp lệ không trước khi tiếp tục
            if (!productId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: "Lỗi: Không xác định được sản phẩm."
                });
                return;
            }
            const productName = this.dataset.productName;
            const productPrice = parseInt(this.dataset.productPrice);
            const productImg = this.dataset.productImg;
            const quantityInput = document.getElementById('quantityInput');
            const quantity = parseInt(quantityInput?.value || 1);
            
            // Lấy tùy chọn size và color nếu có
            const sizeSelect = document.getElementById('productSize');
            const colorSelect = document.getElementById('productColor');
            
            // Chỉ lấy giá trị nếu select box hiển thị (sản phẩm có option)
            const selectedSize = (sizeSelect && sizeSelect.closest('.col-md-6').style.display !== 'none') ? sizeSelect.value : null;
            const selectedColor = (colorSelect && colorSelect.closest('.col-md-6').style.display !== 'none') ? colorSelect.value : null;

            // Validation options nếu cần (chỉ khi sản phẩm có option và option đang hiển thị)
            if (sizeSelect && sizeSelect.closest('.col-md-6').style.display !== 'none' && !selectedSize) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Vui lòng chọn kích thước',
                    text: "Bạn cần chọn kích thước trước khi thêm vào giỏ hàng."
                });
                sizeSelect.focus();
                return;
            }
            if (colorSelect && colorSelect.closest('.col-md-6').style.display !== 'none' && !selectedColor) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Vui lòng chọn màu sắc',
                    text: "Bạn cần chọn màu sắc trước khi thêm vào giỏ hàng."
                });
                colorSelect.focus();
                return;
            }

            // Tạo ID duy nhất cho item trong giỏ hàng
            let cartItemId = productId;
            if (selectedSize) cartItemId += `-${selectedSize}`;
            if (selectedColor) cartItemId += `-${selectedColor}`;

            // Lấy giỏ hàng hiện tại
            const cart = getCart();
            
            // Tìm sản phẩm trong giỏ hàng dựa trên cartItemId
            const existingItemIndex = cart.findIndex(item => item.cartId === cartItemId);

            if (existingItemIndex > -1) {
                // Nếu đã có trong giỏ, tăng số lượng
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Nếu chưa có, thêm mới
                cart.push({
                    cartId: cartItemId,
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImg,
                    quantity: quantity,
                    size: selectedSize,
                    color: selectedColor
                });
            }
            
            // Lưu giỏ hàng
            saveCart(cart);
            
            // Hiển thị thông báo
            let message = `Đã thêm ${quantity} "${productName}"`;
            if (selectedSize) message += ` (Size: ${selectedSize})`;
            if (selectedColor) message += ` (Màu: ${selectedColor})`;
            message += " vào giỏ hàng!";

            Swal.fire({
                icon: 'success',
                title: 'Đã thêm vào giỏ!',
                text: message,
                timer: 2000,
                showConfirmButton: false
            });
        });
    }

    // --- Xử lý nút THÊM VÀO GIỎ cho sản phẩm liên quan ---
    function handleAddToCartRelated(event) {
        const button = event.currentTarget;
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = parseInt(button.dataset.productPrice);
        const productImg = button.dataset.productImg;
        
        const cart = getCart();
        const cartItemId = productId;
        const existingItemIndex = cart.findIndex(item => item.cartId === cartItemId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
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
            title: 'Đã thêm!',
            text: `Đã thêm "${productName}" vào giỏ hàng.`,
            timer: 1500,
            showConfirmButton: false,
        });
    }

    // Gắn sự kiện cho các nút thêm vào giỏ của sản phẩm liên quan
    const relatedAddToCartButtons = document.querySelectorAll('.related-add-to-cart-btn');
    relatedAddToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCartRelated);
    });

    // --- Cập nhật badge khi tải trang (đã có trong common.js) ---
    // updateCartBadge(); // Không cần gọi lại nếu đã có trong common.js và DOMContentLoaded

}); // Kết thúc DOMContentLoaded