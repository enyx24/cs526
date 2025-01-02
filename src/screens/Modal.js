import React from 'react';
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
// import { deleteCategory } from '../database/category';

const CategoryModal = ({
  isVisible,
  closeModal,
  categories,
  newCategory,
  setNewCategory,
  addCategory,
  deleteCategory
}) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Quản lý danh mục</Text>
        <FlatList
          data={categories}
          extraData={categories} // Buộc FlatList cập nhật khi state thay đổi
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.modalItem}>
              <Text>{item.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  deleteCategory(item.id);
                }}
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
        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Màu nền tối hơn với độ mờ
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Thêm khoảng cách ngang
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center', // Căn giữa tiêu đề
  },
  modalItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10, // Góc bo tròn hơn
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between', // Căn đều giữa tên và nút xóa
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // Hiệu ứng nổi cho Android
  },
  textInput: {
    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 20,
    fontSize: 16, // Cỡ chữ lớn hơn
    color: '#333', // Màu chữ tối hơn
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#4CAF50', // Màu xanh lá cho nút thêm
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
    fontSize: 16, // Cỡ chữ lớn hơn
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF5252', // Màu đỏ cho nút xóa
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14, // Cỡ chữ nhỏ hơn một chút
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#607D8B', // Màu xanh xám cho nút đóng
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
    fontSize: 16, // Cỡ chữ lớn hơn
    textAlign: 'center',
  },
});

export default CategoryModal;
