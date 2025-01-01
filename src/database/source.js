// database.js
import SQLite from 'react-native-sqlite-storage';

// Mở cơ sở dữ liệu
const db = SQLite.openDatabase({ name: 'sources.db', location: 'default' });

// Tạo bảng nếu chưa có
export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS sources (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount TEXT, note TEXT)',
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
