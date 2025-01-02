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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  modalItem: {
    backgroundColor: '#FFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  textInput: {
    width: '80%',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#000',
  },
});

export default CategoryModal;
