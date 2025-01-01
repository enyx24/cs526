import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

// Dữ liệu danh mục
const expenseCategories = [
  { id: 1, name: 'Ăn uống' },
  { id: 2, name: 'Chi tiêu hàng ngày' },
  { id: 3, name: 'Quần áo' },
  { id: 4, name: 'Mỹ phẩm' },
  { id: 5, name: 'Phí giao lưu' },
  { id: 6, name: 'Y tế' },
  { id: 7, name: 'Giáo dục' },
  { id: 8, name: 'Tiền điện' },
  { id: 9, name: 'Đi lại' },
  { id: 10, name: 'Phí liên lạc' },
  { id: 11, name: 'Tiền nhà' },
  { id: 12, name: 'Chỉnh sửa >' },
];

const incomeCategories = [
  { id: 1, name: 'Tiền lương' },
  { id: 2, name: 'Tiền phụ cấp' },
  { id: 3, name: 'Tiền thưởng' },
  { id: 4, name: 'Thu nhập phụ' },
  { id: 5, name: 'Đầu tư' },
  { id: 6, name: 'Thu nhập tạm thời' },
  { id: 7, name: 'Chỉnh sửa >' },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('expense'); // Quản lý tab đang chọn

  // Lấy danh mục theo tab
  const categories =
    activeTab === 'expense' ? expenseCategories : incomeCategories;

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity style={styles.datePicker}>
          <Text>01/01/2025 (Th 4)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput style={styles.textInput} placeholder="Chưa nhập vào" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {activeTab === 'expense' ? 'Nguồn chi' : 'Nguồn thu'}
        </Text>
        <TextInput style={styles.textInput} placeholder="Chưa nhập vào" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {activeTab === 'expense' ? 'Tiền chi' : 'Tiền thu'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="0"
          keyboardType="numeric"
        />
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <View style={styles.iconPlaceholder} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
        )}
        style={styles.categoryContainer}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
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
});

export default App;
