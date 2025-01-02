import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { loadSources } from '../database/source';
import { addTransaction, initializeDatabase } from '../database/transaction';
import CategoryModal from './Modal'; // Import Component Modal
import {
  createCategoryTable,
  loadExpenseCategories,
  loadIncomeCategories,
} from '../database/category'; // Import các hàm load danh mục
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import { addCategory, deleteCategory } from '../database/category';

const addCategoryToDatabase = (name, type, callback) => {
  addCategory(name, type, (newCategory) => {
    callback(newCategory); // Trả về toàn bộ đối tượng danh mục mới
  });
};

const deleteCategoryFromDatabase = (id, callback) => {
  console.log('Calling deleteCategoryFromDatabase with id:', id);
  deleteCategory(id, () => {
    console.log('Callback from deleteCategory called');
    callback();
  });
};

const App = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('expense'); // Quản lý tab đang chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái Modal
  const [newCategory, setNewCategory] = useState(''); // Thêm danh mục mới
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date()); // Mặc định là ngày hiện tại
  const [showDatePicker, setShowDatePicker] = useState(false); // Trạng thái hiển thị DatePicker
  const [errorMessage, setErrorMessage] = useState('');
  const [expenseCategories, setExpenseCategories] = useState([]); // Danh mục chi tiêu
  const [incomeCategories, setIncomeCategories] = useState([]); // Danh mục thu nhập
  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục được chọn

  // Hàm mở Modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng Modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Hàm thêm danh mục mới
  const addCategory = () => {
    if (newCategory.trim() === '') return;

    const type = activeTab === 'expense' ? 0 : 1;

    addCategoryToDatabase(newCategory, type, (newCategoryItem) => {
      if (type === 0) {
        setExpenseCategories([...expenseCategories, newCategoryItem]);
      } else {
        setIncomeCategories([...incomeCategories, newCategoryItem]);
      }
      setNewCategory('');
    });
  };

  const deleteCategory1 = (id) => {
    deleteCategoryFromDatabase(id, () => {
      if (activeTab === 'expense') {
        const updatedCategories = expenseCategories.filter(
          (category) => category.id !== id
        );
        setExpenseCategories(updatedCategories);
      } else {
        const updatedCategories = incomeCategories.filter(
          (category) => category.id !== id
        );
        setIncomeCategories(updatedCategories);
      }
    });
  };

  // Gọi hàm tạo bảng khi ứng dụng khởi động
  useEffect(() => {
    createCategoryTable();
    initializeDatabase();
  }, []);

  useEffect(() => {
    // Tải danh sách nguồn tiền khi component được mount
    loadSources((data) => {
      const formattedData = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setSources(formattedData);
    });

    // Tải danh mục chi tiêu
    loadExpenseCategories((categories) => {
      setExpenseCategories([...categories, { id: -1, name: 'Chỉnh sửa' }]);
    });

    // Tải danh mục thu nhập
    loadIncomeCategories((categories) => {
      setIncomeCategories([...categories, { id: -1, name: 'Chỉnh sửa' }]);
    });
  }, []);

  // Lấy danh mục theo tab
  const categories =
    activeTab === 'expense' ? expenseCategories : incomeCategories;

  // Hàm lưu thông tin giao dịch
  const saveTransaction = () => {
    if (!selectedSource || !amount || !selectedCategory) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const transaction = {
      date: date.toISOString().split('T')[0], // Lưu ngày ở định dạng YYYY-MM-DD
      note,
      source: selectedSource,
      amount: parseFloat(amount),
      type: activeTab,
      category: selectedCategory, // Thêm danh mục được chọn
    };

    addTransaction(
      transaction,
      () => {
        setErrorMessage('Thông tin đã được lưu!');
        resetForm();
      },
      (error) => {
        console.log('Lỗi khi lưu:', error);
        setErrorMessage('Không thể lưu thông tin. Vui lòng thử lại!');
      }
    );
  };

  // Reset form sau khi lưu
  const resetForm = () => {
    setSelectedSource(null);
    setNote('');
    setAmount('');
    setSelectedCategory(null); // Đặt lại danh mục
    setDate(new Date());
  };

  // Hàm mở DatePicker
  const showDateSelector = () => {
    setShowDatePicker(true);
  };

  // Hàm xử lý khi chọn ngày
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</Text>
      ) : null}
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expense' && styles.activeTab]}
          onPress={() => setActiveTab('expense')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'expense' && styles.activeTabText,
            ]}
          >
            Tiền chi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'income' && styles.activeTab]}
          onPress={() => setActiveTab('income')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'income' && styles.activeTabText,
            ]}
          >
            Tiền thu
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date and Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ngày</Text>
        <TouchableOpacity style={styles.datePicker} onPress={showDateSelector}>
          <Text>{date.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập ghi chú"
          value={note}
          onChangeText={(text) => setNote(text)}
        />
      </View>

      <View>
        <Text style={styles.label}>
          {activeTab === 'expense' ? 'Nguồn chi' : 'Nguồn thu'}
        </Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedSource(value)}
          value={selectedSource}
          items={sources.length > 0 ? sources : []}
          placeholder={{
            label: 'Chọn nguồn',
            value: null,
          }}
          style={styles.pickerInput}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {activeTab === 'expense' ? 'Tiền chi' : 'Tiền thu'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
      </View>
      {/* Categories */}
      <FlatList
        data={categories}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              item.id === selectedCategory && { borderColor: '#FFA500', borderWidth: 2 },
            ]}
            onPress={() => {
              if (item.id !== -1) {
                setSelectedCategory(item.id);
              } else {
                openModal();
              }
            }}
          >
            <View
              style={[
                styles.iconPlaceholder,
                item.id === -1 && { backgroundColor: '#FFA500' },
              ]}
            />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.categoryContainer}
      />
      <CategoryModal
        isVisible={isModalVisible}
        closeModal={closeModal}
        categories={categories}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        addCategory={addCategory}
        deleteCategory={deleteCategory1} // Truyền hàm deleteCategory1
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={saveTransaction}>
        <Text style={styles.submitText}>
          {activeTab === 'expense' ? 'Nhập khoản chi' : 'Nhập khoản thu'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  activeTab: {
    backgroundColor: '#FFA500',
  },
  tabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePicker: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    paddingVertical: 12,
    backgroundColor: '#FFA500',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginBottom: 8,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 14,
  },
});

export default App;
