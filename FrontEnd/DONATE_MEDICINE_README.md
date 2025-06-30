# Tính Năng Quyên Góp Thuốc (Donate Medicine)

## Tổng Quan
Tính năng Quyên Góp Thuốc cho phép phụ huynh quyên góp thuốc không sử dụng để giúp đỡ cộng đồng. Phụ huynh có thể xem lịch sử quyên góp của bản thân.

## Các Tính Năng Chính

### 1. Form Quyên Góp Thuốc
- **Tên thuốc**: Nhập tên thuốc cần quyên góp
- **Loại thuốc**: Chọn loại thuốc (giảm đau, kháng sinh, vitamin, cảm cúm, hạ sốt, khác)
- **Số lượng**: Số viên/hộp thuốc
- **Hạn sử dụng**: Ngày hết hạn của thuốc
- **Tình trạng**: Còn tốt, rất tốt, tạm được
- **Mô tả chi tiết**: Thông tin bổ sung về thuốc
- **Thông tin liên hệ**: Số điện thoại, địa chỉ nhận thuốc, thời gian thuận tiện

### 2. Lịch Sử Quyên Góp
- Hiển thị tất cả các lần quyên góp của phụ huynh
- Trạng thái quyên góp: Chờ xử lý, Đã chấp nhận, Từ chối, Hoàn thành
- Thông tin chi tiết về từng lần quyên góp
- Ngày tạo quyên góp

### 3. Thông Tin Hướng Dẫn
- Quy trình quyên góp
- Điều kiện thuốc được chấp nhận
- Thuốc không được chấp nhận
- Thông tin liên hệ hỗ trợ

## Cách Truy Cập

### Từ Menu Chính
1. Đăng nhập vào tài khoản Parent
2. Chọn "Quyên Góp Thuốc" từ menu bên trái

### Từ Dashboard
1. Trên trang Dashboard, tìm phần "Thao Tác Nhanh"
2. Nhấn vào button "Quyên Góp Thuốc"

## Quy Trình Sử Dụng

### Để Quyên Góp Thuốc
1. Điền đầy đủ thông tin trong form quyên góp
2. Nhấn "Gửi thông tin quyên góp"
3. Chờ xác nhận từ hệ thống
4. Nhân viên sẽ liên hệ để sắp xếp thời gian nhận thuốc

### Để Xem Lịch Sử
- Lịch sử quyên góp sẽ tự động hiển thị bên phải form
- Có thể xem trạng thái và thông tin chi tiết của từng lần quyên góp

## Điều Kiện Thuốc Được Chấp Nhận

### ✅ Thuốc được chấp nhận:
- Thuốc còn hạn sử dụng ít nhất 3 tháng
- Bao bì nguyên vẹn, không bị rách hoặc mở
- Thuốc được bảo quản đúng cách
- Không phải thuốc kê đơn đặc biệt

### 🚫 Thuốc không được chấp nhận:
- Thuốc đã hết hạn sử dụng
- Thuốc bị hỏng hoặc biến chất
- Thuốc kê đơn đặc biệt (thuốc gây nghiện, thuốc điều trị ung thư...)
- Thuốc không rõ nguồn gốc

## Trạng Thái Quyên Góp

- **Chờ xử lý**: Quyên góp đã được gửi, đang chờ xử lý
- **Đã chấp nhận**: Quyên góp được chấp nhận, sẽ sắp xếp nhận thuốc
- **Từ chối**: Quyên góp không được chấp nhận (có thể do thuốc không đạt điều kiện)
- **Hoàn thành**: Thuốc đã được nhận và phân phối

## Thông Tin Liên Hệ Hỗ Trợ

- **Hotline**: 1900-xxxx
- **Email**: donate@medlearn.com
- **Giờ làm việc**: 8:00 - 18:00 (Thứ 2 - Thứ 6)

## Lưu Ý Kỹ Thuật

### API Endpoints (Cần tạo)
- `POST /api/donations` - Gửi thông tin quyên góp
- `GET /api/donations/parent/{parentId}` - Lấy lịch sử quyên góp của phụ huynh

### Mock Data
Hiện tại tính năng sử dụng mock data để demo. Khi backend tạo API endpoints, cần thay thế các service functions trong `parentService.js`.

### Files Đã Tạo/Chỉnh Sửa
- `FrontEnd/src/pages/Parent/DonateMedicine.jsx` - Trang chính
- `FrontEnd/src/css/Parent/DonateMedicine.css` - Styles
- `FrontEnd/src/services/parentService.js` - Service functions
- `FrontEnd/src/App.jsx` - Routing
- `FrontEnd/src/components/layout/ParentLayout.jsx` - Menu navigation
- `FrontEnd/src/pages/Parent/Dashboard.jsx` - Quick action button
- `FrontEnd/src/css/Parent/Dashboard.css` - Button styles

## Responsive Design
Tính năng được thiết kế responsive và hoạt động tốt trên:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px) 