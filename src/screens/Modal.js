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
import { addCategory, deleteCategory } from '../database/category';

const CategoryModal = ({
  isVisible,
  closeModal,
  categories,
  setCategories,
  newCategory,
  setNewCategory,
}) => {
  // Hàm thêm danh mục mới
  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;

    // Truyền type là 0 (expense) hoặc 1 (income)
    addCategory(newCategory, 0, () => { // Truyền thêm type = 0
        const newCategoryItem = { id: Date.now(), name: newCategory, type: 0 };
        setCategories([...categories, newCategoryItem]); // Cập nhật danh sách danh mục
        setNewCategory(''); // Reset input
    });
    };


  // Hàm xóa danh mục
  const handleDeleteCategory = (id) => {
    deleteCategory(id, () => {
      const updatedCategories = categories.filter((item) => item.id !== id);
      setCategories(updatedCategories); // Cập nhật danh sách danh mục
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Quản lý danh mục</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.modalItem}>
              <Text>{item.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCategory(item.id)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    width: '80%',
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
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
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
