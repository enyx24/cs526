// database.js
import SQLite from 'react-native-sqlite-storage';

// Mở cơ sở dữ liệu
const db = SQLite.openDatabase({ name: 'sources.db', location: 'default' });

// Tạo bảng nếu chưa có
export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS sources (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount INTEGER, note TEXT)',
      [],
      () => {
        console.log('Table created successfully');
      },
      error => {
        console.log('Error creating table: ', error);
      }
    );
  });
};

// Thêm nguồn tiền vào bảng
export const addSource = (name, amount, note, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO sources (name, amount, note) VALUES (?, ?, ?)',
      [name, amount, note],
      () => {
        console.log('Source added successfully');
        callback();
      },
      error => {
        console.log('Error inserting data: ', error);
      }
    );
  });
};

// Tải danh sách nguồn tiền
export const loadSources = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM sources',
      [],
      (tx, results) => {
        let sourcesList = [];
        for (let i = 0; i < results.rows.length; i++) {
          sourcesList.push(results.rows.item(i));
        }
        callback(sourcesList);
      },
      error => {
        console.log('Error fetching data: ', error);
      }
    );
  });
};

// Xóa nguồn tiền
export const deleteSource = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM sources WHERE id = ?',
      [id],
      () => {
        console.log('Source deleted successfully');
        callback();
      },
      error => {
        console.log('Error deleting data: ', error);
      }
    );
  });
};

// Cập nhật số tiền của nguồn tiền
export const updateSourceAmount = (id, newAmount, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE sources SET amount = ? WHERE id = ?',
      [newAmount.toString(), id],
      () => {
        console.log('Source amount updated successfully');
        callback();
      },
      error => {
        console.log('Error updating source amount: ', error);
      }
    );
  });
};
// Lấy thông tin nguồn tiền cụ thể
export const getSourceById = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM sources WHERE id = ?',
      [id],
      (tx, results) => {
        if (results.rows.length > 0) {
          callback(results.rows.item(0));
        } else {
          callback(null);
        }
      },
      error => {
        console.log('Lỗi khi lấy nguồn tiền:', error);
      }
    );
  });
};
//chuyển tiền
export const transferAmount = (fromId, toId, amount, callback) => {
  db.transaction(tx => {
    // Trừ tiền từ nguồn gốc
    tx.executeSql(
      'UPDATE sources SET amount = amount - ? WHERE id = ? AND amount >= ?',
      [amount, fromId, amount],
      (_, result) => {
        if (result.rowsAffected > 0) {
          // Cộng tiền vào nguồn đích
          tx.executeSql(
            'UPDATE sources SET amount = amount + ? WHERE id = ?',
            [amount, toId],
            () => {
              console.log('Transfer completed successfully');
              callback(true); // Thành công
            },
            error => {
              console.log('Error adding amount to destination:', error);
              callback(false); // Lỗi
            }
          );
        } else {
          console.log('Insufficient balance or invalid source');
          callback(false); // Số dư không đủ
        }
      },
      error => {
        console.log('Error deducting amount from source:', error);
        callback(false); // Lỗi
      }
    );
  });
};