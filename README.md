TechZone - Shop Bán Hàng Điện Tử
TechZone là một trang web bán hàng điện tử với đầy đủ chức năng từ hiển thị sản phẩm, trang chi tiết, giỏ hàng, đăng ký/đăng nhập và quản lý đơn hàng. Dự án được xây dựng với HTML, CSS, JavaScript và Bootstrap 5.
🔗 Live Demo: https://huypv2002.github.io/TechZonee/

📋 Mục lục
Cấu trúc dự án
Tính năng
Cấu trúc mã nguồn
Hướng dẫn cài đặt
Tính năng chi tiết
Quản lý trạng thái
Công nghệ sử dụng

✨ Tính năng
Hiển thị sản phẩm
Trang chủ hiển thị sản phẩm nổi bật
Trang sản phẩm hiển thị tất cả sản phẩm
Trang chi tiết sản phẩm với thông tin đầy đủ
Hiển thị sản phẩm liên quan
Giỏ hàng
Thêm sản phẩm vào giỏ hàng
Cập nhật số lượng (tăng/giảm)
Xóa sản phẩm khỏi giỏ hàng
Tính tổng tiền
Lưu giỏ hàng trong localStorage
Tài khoản
Đăng ký tài khoản
Đăng nhập
Đăng xuất
Hiển thị thông tin người dùng đã đăng nhập
Tìm kiếm & Lọc
Tìm kiếm sản phẩm theo từ khóa
Hiển thị kết quả tìm kiếm
Quản lý đơn hàng
Xem lịch sử đơn hàng
Lọc đơn hàng theo trạng thái
Giao diện & UI
Responsive design (tương thích với các thiết bị)
SweetAlert thay thế alert mặc định
Bootstrap 5 cho layout và components
💻 Cấu trúc mã nguồn
1. HTML Files
1.1 index.html
Trang chủ hiển thị sản phẩm nổi bật, banner quảng cáo và các danh mục sản phẩm.
1.2 products.html
Hiển thị toàn bộ sản phẩm có trong cửa hàng với bộ lọc và phân trang.
1.3 product-detail.html
Hiển thị thông tin chi tiết về một sản phẩm cụ thể, gồm hình ảnh, mô tả, thông số kỹ thuật, và tùy chọn (màu sắc, kích thước).
1.4 cart.html
Hiển thị giỏ hàng của người dùng, cho phép thay đổi số lượng và xóa sản phẩm.
1.5 login.html & register.html
Trang đăng nhập và đăng ký tài khoản.
1.6 order-history.html
Hiển thị lịch sử đơn hàng của người dùng đã đăng nhập.
1.7 about.html
Trang giới thiệu về cửa hàng, lịch sử và đội ngũ.
1.8 search.html
Hiển thị kết quả tìm kiếm sản phẩm.
2. JavaScript Files
2.1 common.js
Chứa các hàm dùng chung cho toàn bộ trang web:
2.2 cart.js
Xử lý chức năng giỏ hàng, bao gồm:
Hiển thị sản phẩm trong giỏ
Tăng/giảm số lượng sản phẩm
Xóa sản phẩm
Tính toán tổng tiền
Xử lý trường hợp giỏ rỗng
2.3 product-detail.js
Xử lý trang chi tiết sản phẩm:
Hiển thị thông tin sản phẩm từ database mô phỏng
Xử lý các tùy chọn sản phẩm (màu sắc, kích thước)
Thêm sản phẩm vào giỏ hàng
Hiển thị sản phẩm liên quan
2.4 login.js & register.js
Xử lý chức năng đăng nhập và đăng ký:
Đăng ký tài khoản mới
Đăng nhập với tài khoản đã đăng ký
Lưu thông tin người dùng vào localStorage
Hiển thị thông báo thành công/thất bại
2.5 order-history.js
Xử lý chức năng lịch sử đơn hàng:
Hiển thị danh sách đơn hàng
Lọc theo trạng thái đơn hàng
Xử lý các nút hành động trên đơn hàng
2.6 index.js & products.js
Xử lý hiển thị sản phẩm trên trang chủ và trang sản phẩm:
Hiển thị sản phẩm nổi bật
Thêm sản phẩm vào giỏ hàng từ trang danh sách
Cập nhật badge số lượng sản phẩm trong giỏ
2.7 search.js
Xử lý chức năng tìm kiếm:
Lấy từ khóa tìm kiếm từ URL
Tìm kiếm sản phẩm khớp với từ khóa
Hiển thị kết quả tìm kiếm
🚀 Hướng dẫn cài đặt
Clone repository:
Run
Mở thư mục dự án:
Run
Mở trang web:
Mở file index.html bằng trình duyệt web
Hoặc sử dụng extension Live Server trong VSCode
Để deploy lên GitHub Pages:
Run
🔍 Tính năng chi tiết
1. Quản lý giỏ hàng
Giỏ hàng được lưu trong localStorage với cấu trúc:
Thêm sản phẩm: Có thể thêm từ trang chủ, trang sản phẩm, hoặc trang chi tiết
Tăng/giảm số lượng: Nút +/- trên trang giỏ hàng
Xóa sản phẩm: Nút xóa trên trang giỏ hàng với xác nhận SweetAlert
Tự động cập nhật tổng tiền: Mỗi khi có thay đổi trong giỏ hàng
2. Quản lý tài khoản người dùng
Tài khoản người dùng được lưu trong localStorage:
Đăng ký: Kiểm tra email đã tồn tại, độ dài mật khẩu
Đăng nhập: Kiểm tra thông tin khớp với dữ liệu đã đăng ký
Đăng xuất: Xóa session và cập nhật UI
Hiển thị thông tin: Hiển thị tên người dùng đã đăng nhập
3. Trang chi tiết sản phẩm
Hiển thị thông tin đầy đủ: Tên, giá, mô tả, thông số kỹ thuật
Chọn tùy chọn: Màu sắc, kích thước (nếu có)
Xem hình ảnh: Thumbnail và hình ảnh chính
Chọn số lượng: Tăng/giảm số lượng trước khi thêm vào giỏ
Sản phẩm liên quan: Hiển thị sản phẩm tương tự
4. Lịch sử đơn hàng
Phân loại theo trạng thái: Tất cả, Chờ xác nhận, Chờ lấy hàng, Đang giao, Đã giao, Đã hủy
Hiển thị thông tin đơn hàng: Mã đơn, danh sách sản phẩm, tổng tiền, trạng thái
Xử lý hành động: Mua lại, xem chi tiết, hủy đơn (tùy theo trạng thái)
💾 Quản lý trạng thái
Dự án sử dụng localStorage để lưu trữ và quản lý dữ liệu:
cartItems: Lưu thông tin giỏ hàng
registeredUsers: Lưu danh sách người dùng đã đăng ký
userSession: Lưu thông tin phiên đăng nhập hiện tại
Các hàm chính để thao tác với localStorage:
🛠️ Công nghệ sử dụng
HTML5: Cấu trúc trang web
CSS3: Styling và responsive design
JavaScript: Xử lý logic client-side
Bootstrap 5: Framework CSS cho giao diện người dùng
SweetAlert2: Thông báo đẹp mắt thay thế alert mặc định
LocalStorage: Lưu trữ dữ liệu client-side
GitHub Pages: Hosting và triển khai dự án
