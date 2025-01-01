import SQLite from 'react-native-sqlite-storage';

// Mở cơ sở dữ liệu
const db = SQLite.openDatabase({ name: 'sources.db', location: 'default' });

// Tạo bảng nếu chưa có
export const createCategoryTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type INTEGER)',
      [],
      () => {
        console.log('Category table created successfully');
      },
      error => {
        console.log('Error creating category table: ', error);
      }
    );
  });
};

export const addCategory = (name, type, callback) => {
  if (!name || name.trim() === '') {
    console.log('Category name is required');
    return;
  }

  if (type !== 0 && type !== 1) {
    console.log('Invalid category type');
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO categories (name, type) VALUES (?, ?)',
      [name.trim(), type],
      () => {
        console.log('Category added successfully');
        if (callback) {
          callback(); // Chỉ gọi callback nếu nó tồn tại
        }
      },
      error => {
        console.log('Error inserting category: ', error);
      }
    );
  });
};


// Tải danh sách danh mục với type = 0
export const loadExpenseCategories = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM categories WHERE type = 0',
      [],
      (tx, results) => {
        let expenseCategoriesList = [];
        for (let i = 0; i < results.rows.length; i++) {
          expenseCategoriesList.push(results.rows.item(i));
        }
        callback(expenseCategoriesList);
      },
      error => {
        console.log('Error fetching expense categories: ', error);
      }
    );
  });
};

// Tải danh sách danh mục với type = 1
export const loadIncomeCategories = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM categories WHERE type = 1',
      [],
      (tx, results) => {
        let incomeCategoriesList = [];
        for (let i = 0; i < results.rows.length; i++) {
          incomeCategoriesList.push(results.rows.item(i));
        }
        callback(incomeCategoriesList);
      },
      error => {
        console.log('Error fetching income categories: ', error);
      }
    );
  });
};


// Xóa danh mục
export const deleteCategory = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM categories WHERE id = ?',
      [id],
      () => {
        console.log('Category deleted successfully');
        callback();
      },
      error => {
        console.log('Error deleting category: ', error);
      }
    );
  });
};

