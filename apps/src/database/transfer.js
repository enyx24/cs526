import SQLite from 'react-native-sqlite-storage';

// Mở cơ sở dữ liệu
const db = SQLite.openDatabase({ name: 'sources.db', location: 'default' });

// Tạo bảng lưu thông tin chuyển tiền
export const createTransferTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transfers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromSource TEXT,
        toSource TEXT,
        amount INTEGER,
        transferDate TEXT
      );`
    );
  });
};

// Hàm thêm giao dịch chuyển tiền
export const addTransfer = (fromSource, toSource, amount, callback) => {
  const transferDate = new Date().toISOString();
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO transfers (fromSource, toSource, amount, transferDate) VALUES (?, ?, ?, ?)',
      [fromSource, toSource, amount, transferDate],
      () => {
        console.log('Transfer added successfully');
        if (callback) callback();
      },
      (error) => {
        console.error('Error adding transfer:', error);
      }
    );
  });
};

// Hàm lấy danh sách giao dịch chuyển tiền
export const getTransfers = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM transfers ORDER BY transferDate DESC',
      [],
      (_, results) => {
        const transfers = [];
        for (let i = 0; i < results.rows.length; i++) {
          transfers.push(results.rows.item(i));
        }
        callback(transfers);
      },
      (error) => {
        console.error('Error fetching transfers:', error);
      }
    );
  });
};

// Hàm xóa toàn bộ lịch sử chuyển tiền
export const deleteAllTransfers = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM transfers',
      [],
      () => {
        console.log('All transfers deleted successfully');
        if (callback) callback(true);
      },
      (error) => {
        console.error('Error deleting all transfers:', error);
        if (callback) callback(false);
      }
    );
  });
};
