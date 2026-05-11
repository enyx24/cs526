import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { writeFile } from 'react-native-fs'; // Dùng react-native-fs để thao tác với file
import XLSX from 'xlsx'; // Import thư viện xlsx
import FileViewer from 'react-native-file-viewer'; // Thay OpenAnything bằng react-native-file-viewer
import { getExpenseTransactions, getIncomeTransactions } from '../database/transaction'; // Đổi đường dẫn tới file database là 'transaction.js'

const ExportButton = () => {
  const exportToExcel = async () => {
    try {
      // Lấy dữ liệu từ database
      const expenseTransactions = await new Promise((resolve) => getExpenseTransactions(resolve));
      const incomeTransactions = await new Promise((resolve) => getIncomeTransactions(resolve));
      console.log("Tui bị ngu 2");
      console.log("Expense Transactions:", expenseTransactions);
      console.log("Income Transactions:", incomeTransactions);

      // Chuyển dữ liệu thành một bảng Excel
      const data = [];

      // Đưa giao dịch chi tiêu vào bảng với số tiền âm
      expenseTransactions.forEach((item) => {
        data.push([
            // item.id, // STT
            item.type, // Loại
            Math.abs(item.amount), // Số tiền
            item.date, // Ngày
            item.category, // Danh mục
            item.source, // Nguồn
            item.note, // Ghi chú
        ]);
      });

      // Đưa giao dịch thu nhập vào bảng với số tiền dương
      incomeTransactions.forEach((item) => {
        data.push([
        //   item.id, // STT
          item.type, // Loại
          Math.abs(item.amount), // Số tiền
          item.date, // Ngày
          item.category, // Danh mục
          item.source, // Nguồn
          item.note, // Ghi chú
        ]);
      });

      // Tạo một worksheet từ dữ liệu
      const ws = XLSX.utils.aoa_to_sheet([
        ['Loại giao dịch', 'Số tiền', 'Ngày', 'Danh mục', 'Nguồn', 'Ghi chú'], // Header
        ...data, // Dữ liệu
      ]);

      // Tạo một workbook và thêm worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'transactions');

      // Chuyển đổi workbook thành file Excel
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

      // Lưu file vào hệ thống (external storage - Android)
      const path = `/storage/emulated/0/Documents/Transactions.xlsx`; // Đổi đường dẫn file lưu
      await writeFile(path, wbout, 'base64');

      // Log ra đường dẫn của file đã lưu
      console.log('File đã được lưu tại: ' + path);

      // Thông báo thành công và mở file
      Alert.alert(
        'Thành công',
        `File Excel đã được lưu tại Bộ nhớ trong/Documents/Transaction.xlsx. Bạn có muốn mở không?`,
        [
          { text: 'Không', style: 'cancel' },
          {
            text: 'Có',
            onPress: () => {
              FileViewer.open(path) // Dùng react-native-file-viewer để mở file
                .then(() => {
                  console.log('File mở thành công');
                })
                .catch((error) => {
                  console.error('Lỗi khi mở file:', error);
                  Alert.alert('Lỗi', 'Không thể mở file.');
                });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      Alert.alert('Lỗi', 'Không thể xuất file Excel.');
    }
  };

  const handlePress = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn xuất dữ liệu ra file Excel không?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: exportToExcel, // Gọi hàm exportToExcel nếu người dùng chọn "Có"
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity style={styles.exportButton} onPress={handlePress}>
      <Text style={styles.exportButtonText}>Export</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exportButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ExportButton;
