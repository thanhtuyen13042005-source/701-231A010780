document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // BÀI 1: TÌM KIẾM SẢN PHẨM TỪ MẢNG JS
    // ==========================================
    const products = [
        { id: 1, name: "Laptop Gaming ASUS", price: "20,000,000 VND" },
        { id: 2, name: "Điện thoại iPhone 15", price: "22,000,000 VND" },
        { id: 3, name: "Tai nghe Bluetooth Sony", price: "2,500,000 VND" },
        { id: 4, name: "Bàn phím cơ Keychron", price: "1,800,000 VND" },
        { id: 5, name: "Màn hình Dell UltraSharp", price: "6,000,000 VND" }
    ];

    // Tạo giao diện tìm kiếm động nếu chưa có trên HTML
    const practiceContainer = document.getElementById("practice-section");
    if (practiceContainer) {
        practiceContainer.innerHTML = `
            <div style="margin-top: 20px; padding: 15px; background: #fff; border-radius: 8px;">
                <h3>1. Tìm kiếm sản phẩm</h3>
                <input type="text" id="searchInput" placeholder="Nhập tên sản phẩm..." style="padding: 8px; width: 60%; margin-right: 10px;">
                <button id="searchBtn" style="padding: 8px 15px; background: #3498db; color: #fff; border: none; cursor: pointer;">Tìm kiếm</button>
                <div id="searchResult" style="margin-top: 15px;"></div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fff; border-radius: 8px;">
                <h3>2. Đăng ký tài khoản (Validate & LocalStorage)</h3>
                <form id="registerForm" style="display: flex; flex-direction: column; gap: 10px; max-width: 400px;">
                    <input type="text" id="regName" placeholder="Họ và tên" required style="padding: 8px;">
                    <input type="email" id="regEmail" placeholder="Email hợp lệ" required style="padding: 8px;">
                    <input type="password" id="regPassword" placeholder="Mật khẩu (>= 8 ký tự, có chữ hoa, thường, số)" required style="padding: 8px;">
                    <label><input type="checkbox" id="regAgree"> Đồng ý điều khoản</label>
                    <button type="submit" style="padding: 8px; background: #2ecc71; color: #fff; border: none; cursor: pointer;">Đăng ký</button>
                </form>
                <div id="formMsg" style="margin-top: 10px; font-weight: bold;"></div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fff; border-radius: 8px;">
                <h3>3. Đồng hồ đếm ngược (10 Phút)</h3>
                <div id="countdownTimer" style="font-size: 32px; font-weight: bold; color: #e74c3c;">10:00</div>
            </div>
        `;
    }

    // Logic xử lý tìm kiếm sản phẩm
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchResult = document.getElementById("searchResult");

    function handleSearch() {
        const keyword = searchInput.value.trim().toLowerCase();
        if (!keyword) {
            searchResult.innerHTML = "<p style='color: red;'>Vui lòng nhập từ khóa tìm kiếm!</p>";
            return;
        }

        // Lọc sản phẩm không phân biệt hoa thường, tránh lỗi injection bằng cách sử dụng textContent thay vì innerHTML trực tiếp cho dữ liệu người dùng
        const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));

        if (filtered.length === 0) {
            searchResult.innerHTML = "<p style='color: red;'>Không tìm thấy sản phẩm phù hợp!</p>";
        } else {
            let html = "<ul>";
            filtered.forEach(p => {
                html += `<li><strong>${p.name}</strong> - Giá: ${p.price}</li>`;
            });
            html += "</ul>";
            searchResult.innerHTML = html;
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", handleSearch);
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleSearch();
        });
    }

    // ==========================================
    // BÀI 2: VALIDATE FORM & LOCALSTORAGE
    // ==========================================
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("regName").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value;
            const agree = document.getElementById("regAgree").checked;
            const formMsg = document.getElementById("formMsg");

            // Kiểm tra điều kiện mật khẩu: ít nhất 8 ký tự, có chữ hoa, chữ thường và số
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!agree) {
                formMsg.style.color = "red";
                formMsg.textContent = "Bạn phải đồng ý với điều khoản!";
                return;
            }

            if (!passwordRegex.test(password)) {
                formMsg.style.color = "red";
                formMsg.textContent = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!";
                return;
            }

            // Lưu dữ liệu vào LocalStorage an toàn
            const userData = { name, email };
            localStorage.setItem("user_registered", JSON.stringify(userData));

            formMsg.style.color = "green";
            formMsg.textContent = "Đăng ký thành công! Dữ liệu đã được lưu vào LocalStorage.";
            registerForm.reset();
        });
    }

    // ==========================================
    // BÀI 3: ĐỒNG HỒ ĐẾM NGƯỢC (10 PHÚT)
    // ==========================================
    const timerDisplay = document.getElementById("countdownTimer");
    if (timerDisplay) {
        let totalSeconds = 10 * 60; // 10 phút = 600 giây

        const intervalId = setInterval(() => {
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            // Định dạng hiển thị MM:SS
            let mStr = minutes < 10 ? "0" + minutes : minutes;
            let sStr = seconds < 10 ? "0" + seconds : seconds;
            timerDisplay.textContent = `${mStr}:${sStr}`;

            // Thêm hiệu ứng cảnh báo khi dưới 1 phút (60 giây)
            if (totalSeconds <= 60) {
                timerDisplay.style.animation = "blink 0.5s infinite alternate";
            }

            if (totalSeconds <= 0) {
                clearInterval(intervalId);
                alert("Hết thời gian làm bài!");
            }

            totalSeconds--;
        }, 1000);
    }
});