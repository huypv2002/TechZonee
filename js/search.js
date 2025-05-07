// ----- Phần JavaScript để xử lý động sau này -----

const urlParams = new URLSearchParams(window.location.search);
const keyword = urlParams.get('keyword') || "[Chưa nhập từ khóa]"; // Lấy từ khóa hoặc dùng mặc định

// Cập nhật tiêu đề và các nơi hiển thị từ khóa
document.getElementById('searchKeyword').textContent = keyword;
const noResultsKeywordSpan = document.querySelector('#no-search-results .search-keyword');
if (noResultsKeywordSpan) {
    noResultsKeywordSpan.textContent = keyword;
}
// Cập nhật giá trị trong ô tìm kiếm header (nếu muốn)
const headerSearchInput = document.querySelector('.navbar form input[name="keyword"]');
if (headerSearchInput) {
    headerSearchInput.value = keyword;
}


// ----- Logic tìm kiếm và hiển thị kết quả (Mô phỏng) -----
function performSearch(searchTerm) {
    console.log("Đang tìm kiếm:", searchTerm);
    const searchResultsGrid = document.getElementById('searchResultsGrid');
    const noResultsDiv = document.getElementById('no-search-results');
    const pagination = document.getElementById('searchPagination');
    const resultsCountP = document.getElementById('resultsCount');

    // Xóa kết quả cũ (quan trọng khi tìm kiếm lại hoặc phân trang)
    searchResultsGrid.innerHTML = '';

    // --- lấy dữ liệu sản phẩm thực tế (từ API, localStorage, ...) ---
    // --- và lọc dựa trên searchTerm ---
    // --- Ví dụ dữ liệu cứng ---
    const allProducts = [
        { id: 1, name: 'Áo thun nam Cotton Basic Fit', price: '150.000₫', img: 'https://via.placeholder.com/300x250/EEEEEE/DC3545?text=Ao+Thun+Nam' },
        { id: 2, name: 'Áo thun nữ cổ tròn in hình', price: '180.000₫', img: 'https://via.placeholder.com/300x250/EEEEEE/DC3545?text=Ao+Thun+Nu' },
        { id: 3, name: 'Áo Polo nam thể thao', price: '250.000₫', img: 'https://via.placeholder.com/300x250/EEEEEE/DC3545?text=Ao+Polo' },
        { id: 4, name: 'Áo thun trẻ em cotton mát lạnh', price: '99.000₫', img: 'https://via.placeholder.com/300x250/EEEEEE/DC3545?text=Ao+Thun+Tre+Em' },
        { id: 5, name: 'Quần Jeans Nam Rách Gối', price: '350.000₫', img: 'https://via.placeholder.com/300x250/EEEEEE/007BFF?text=Quan+Jean' }, // Sản phẩm không khớp
    ];

    const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cập nhật số lượng kết quả
    resultsCountP.textContent = `Tìm thấy ${results.length} kết quả.`;


    if (results.length > 0) {
        noResultsDiv.style.display = 'none'; // Ẩn thông báo không có kết quả
        pagination.style.display = 'flex'; // Hiện phân trang (nếu cần)
        searchResultsGrid.style.display = 'flex'; // Hiện lưới kết quả

        // Tạo HTML cho từng sản phẩm tìm được
        results.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card h-100 shadow-sm border-0 card-product">
                    <a href="product-detail.html?id=${product.id}"> //                          <img src="${product.img}" class="card-img-top" alt="${product.name}">
                    </a>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title flex-grow-1"><a href="product-detail.html?id=${product.id}" class="text-dark text-decoration-none">${product.name}</a></h5>
                        <p class="card-text mt-2">${product.price}</p>
                         <a href="#" class="btn btn-danger btn-sm w-100 mt-auto" onclick="addToCart(${product.id})"><i class="bi bi-cart-plus-fill"></i> Thêm vào giỏ</a>
                    </div>
                </div>
            `;
            searchResultsGrid.appendChild(col);
        });

        // ----- Logic phân trang sẽ cần thêm ở đây -----

    } else {
        // Không tìm thấy kết quả nào
        searchResultsGrid.style.display = 'none'; // Ẩn lưới sản phẩm
        pagination.style.display = 'none'; // Ẩn phân trang
        noResultsDiv.style.display = 'block'; // Hiện thông báo không có kết quả
    }
}

// Gọi hàm tìm kiếm khi trang tải xong (lấy từ khóa từ URL)
document.addEventListener('DOMContentLoaded', () => {
    performSearch(keyword);
});

// Placeholder cho hàm thêm vào giỏ
function addToCart(productId) {
    console.log("Đã thêm sản phẩm ID:", productId, "vào giỏ (cần logic JS)");
    // Thêm logic localStorage ở đây
    
    // Thay thế alert này bằng SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'Đã thêm vào giỏ!',
        text: "Sản phẩm đã được thêm vào giỏ hàng.",
        timer: 1500,
        showConfirmButton: false
    });
}