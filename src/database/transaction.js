import SQLite from 'react-native-sqlite-storage';

// Mở cơ sở dữ liệu
const db = SQLite.openDatabase({ name: 'sources.db', location: 'default' });

// Hàm khởi tạo database (tạo bảng)
export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        note TEXT,
        source TEXT,
        amount REAL,
        type TEXT,
        category TEXT
      );`
    );
  });
};

// Hàm thêm dữ liệu vào bảng transactions
export const addTransaction = (transaction, successCallback, errorCallback) => {
  const { date, note, source, amount, type, category } = transaction;

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO transactions (date, note, source, amount, type, category) VALUES (?, ?, ?, ?, ?, ?);`,
      [date, note, source, parseFloat(amount), type, category],
      (_, result) => {
        if (successCallback) successCallback(result);
      },
      (error) => {
        if (errorCallback) errorCallback(error);
      }
    );
  });
};

// Hàm lấy danh sách các giao dịch chi tiêu
export const getExpenseTransactions = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM transactions WHERE type = 'expense';`,
      [],
      (_, result) => {
        const rows = result.rows;
        let transactions = [];
        for (let i = 0; i < rows.length; i++) {
          transactions.push(rows.item(i));
        }
        callback(transactions);
      },
      (error) => {
        console.log('Lỗi khi lấy dữ liệu giao dịch chi tiêu:', error);
      }
    );
  });
};

// Hàm lấy danh sách các giao dịch thu nhập
export const getIncomeTransactions = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM transactions WHERE type = 'income';`,
      [],
      (_, result) => {
        const rows = result.rows;
        let transactions = [];
        for (let i = 0; i < rows.length; i++) {
          transactions.push(rows.item(i));
        }
        callback(transactions);
      },
      (error) => {
        console.log('Lỗi khi lấy dữ liệu giao dịch thu nhập:', error);
      }
    );
  });
};

// Hàm xóa một giao dịch theo id
export const deleteTransaction = (id, successCallback, errorCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM transactions WHERE id = ?;`,
      [id],
      (_, result) => {
        if (successCallback) successCallback(result);
      },
      (error) => {
        if (errorCallback) errorCallback(error);
      }
    );
  });
};

// Thêm hàm getTransactions vào transaction.js
export const getTransactions = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM transactions;`,
      [],
      (_, result) => {
        const rows = result.rows;
        let transactions = [];
        for (let i = 0; i < rows.length; i++) {
          transactions.push(rows.item(i));
        }
        callback(transactions);
      },
      (error) => {
        console.log('Lỗi khi lấy dữ liệu:', error);
      }
    );
  });
};

export default db;
