# Đồ án cuối kỳ CS526: Ứng dụng quản lý chi tiêu

## What's news:
- [NEW] Chuyển từ app được thầy An nhận xét là "app làm được gì thì google sheet làm tốt hơn" sang "app làm được gì thì google sheet làm tốt hơn nhưng có services AI Backend" 
- [NEW] Dev một services SLM BE để thực hiện parsing thay cho REGEX ở bản trước
- [NEW] Automate workflow bằng GH Action và docker
- [NEW] Free unlimit SLM API cho đến hiện tại, với server đảm bảo uptime 90%
- [WIP] Metrics endpoint cho monitoring

## Thành viên nhóm
| Tên                | MSSV      |
|--------------------|-----------|
| Nguyễn Thái Học    | 22520488  |
| Nguyễn Duy Khang   | 22520619  |
| Nguyễn Trọng Nhân  | 22521005  |

## Hướng dẫn cài đặt
0. **Release [APK](https://github.com/enyx24/cs526/releases/tag/v1.0.0)**
   - Tải về và cài đặt trên trực tiếp trên thiết bi, hoặc dùng source code như bên dưới.

1. **Yêu cầu hệ thống**:
   - Docker
   - Android Debug Bridge (ADB)

2. **Các bước cài đặt và chạy ứng dụng**:
   - **Tạo container từ Docker image**:
     ```bash
     docker run -it --rm -v $(pwd):/app -w /app reactnativecommunity/react-native-android bash
     ```

   - **Clone repository từ GitHub**:
     ```bash
     git clone https://github.com/enyx24/cs526
     cd cs526
     ```

   - **Kết nối thiết bị Android**:
     - Đảm bảo thiết bị đã kết nối qua USB Debug hoặc Wireless Debug 
     - Kiểm tra kết nối:
       ```bash
       adb devices
       ```

   - **Cài đặt các dependency**:
     ```bash
     npm install
     ```

   - **Khởi động ứng dụng**:
     ```bash
     npm start
     ```
     Sau đó, nhấn phím `a` để khởi chạy ứng dụng trên thiết bị Android.

## Kiến trúc

```
                          ┌─────────── Docker Compose ──────────────┐
┌───────────────────┐     │   ┌───────────┐         ┌────────────┐  │
│  ReactNative App  │ <-----> │  Backend  │ <-----> │ LLaMa.cpp  │  │
└───────────────────┘     │   └───────────┘         └────────────┘  │
                          └─────────────────────────────────────────┘
```

## Chức năng chính
1. **Quản lý danh mục thu/chi**:
   - Thêm, xóa hoặc xem danh sách các danh mục thu/chi hiện tại.

2. **Quản lý các nguồn tiền**:
   - Thêm, xóa hoặc xem danh sách các nguồn tiền.

3. **Quản lý giao dịch thu/chi**:
   - Thêm, xem, tìm kiếm hoặc xóa các giao dịch thu/chi cụ thể.

4. **Báo cáo tài chính**:
   - Xem báo cáo tài chính trong một khoảng thời gian cụ thể.

5. **Nhận diện giao dịch từ ảnh chụp màn hình**:
   - Đọc kết quả giao dịch chi tiền từ ảnh chụp màn hình chuyển khoản.

6. **Xuất giao dịch ra file Excel**:
   - Xuất tất cả giao dịch thu/chi thành một file Excel để lưu trữ hoặc phân tích thêm.

7. **Chuyển tiền giữa các nguồn tiền**:
   - Thực hiện chuyển tiền giữa các nguồn, xem lại hoặc xóa lịch sử luân chuyển tiền.
