import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';

const CategoryModal = ({
  isVisible,
  closeModal,
  categories,
  newCategory,
  setNewCategory,
  addCategory,
  deleteCategory,
}) => {
  const [errorMessage, setErrorMessage] = useState(''); // Thêm trạng thái thông báo lỗi

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
      setErrorMessage('Tên danh mục không được để trống!');
      return;
    }

    const isDuplicate = categories.some(
      (category) => category.name.toLowerCase() === newCategory.trim().toLowerCase()
    );

    if (isDuplicate) {
      setErrorMessage('Tên danh mục đã tồn tại!');
      return;
    }

    setErrorMessage(''); // Xóa thông báo lỗi nếu hợp lệ
    addCategory();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Quản lý danh mục</Text>

        {/* Hiển thị thông báo lỗi */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <FlatList
          data={categories}
          extraData={categories} // Buộc FlatList cập nhật khi state thay đổi
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.modalItem}>
              <Text>{item.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteCategory(item.id)}
              >
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Thêm danh mục mới"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FF5252',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  textInput: {
    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#607D8B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CategoryModal;
