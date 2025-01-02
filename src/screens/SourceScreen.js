import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { createTable, addSource, loadSources, deleteSource } from '../database/source';

const App = () => {
  const [name, setName] = useState(''); // Tên nguồn tiền
  const [amount, setAmount] = useState(''); // Số tiền
  const [note, setNote] = useState(''); // Ghi chú
  const [sources, setSources] = useState([]); // Danh sách nguồn tiền
  const [showCreateSource, setShowCreateSource] = useState(true); // Điều khiển màn hình tạo nguồn tiền
  const [showSourceList, setShowSourceList] = useState(false); // Điều khiển màn hình danh sách nguồn tiền

  // Tạo bảng khi lần đầu tiên sử dụng ứng dụng
  useEffect(() => {
    createTable();
  }, []);

  // Hàm thêm nguồn tiền
  const handleAddSource = () => {
    if (!name || !amount) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    addSource(name, parseFloat(amount).toLocaleString() + ' đ', note, () => {
      loadSourcesList();
    });

    setName('');
    setAmount('');
    setNote('');
  };

  // Tải danh sách nguồn tiền
  const loadSourcesList = () => {
    loadSources(setSources);
  };

  // Hàm xóa nguồn tiền
  const handleDeleteSource = (id) => {
    deleteSource(id, () => {
      loadSourcesList();
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.sourceItem}>
      <Text style={styles.sourceName}>{item.name}</Text>
      <Text style={styles.sourceAmount}>{item.amount}</Text>
      {item.note ? <Text style={styles.sourceNote}>{item.note}</Text> : null}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteSource(item.id)}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Phần các nút chuyển đổi */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, showCreateSource && styles.activeButton]}
          onPress={() => {
            setShowCreateSource(true);
            setShowSourceList(false);
          }}
        >
          <Text style={styles.buttonText}>Tạo Nguồn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, showSourceList && styles.activeButton]}
          onPress={() => {
            setShowCreateSource(false);
            setShowSourceList(true);
            loadSourcesList(); // Tải danh sách nguồn tiền khi hiển thị danh sách
          }}
        >
          <Text style={styles.buttonText}>Danh Sách Nguồn</Text>
        </TouchableOpacity>
      </View>

      {/* Phần Tạo Nguồn Tiền */}
      {showCreateSource && (
        <View style={styles.createSection}>
          <Text style={styles.title}>Tạo Nguồn Tiền</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên nguồn tiền</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên nguồn tiền"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số tiền</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số tiền"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ghi chú</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập ghi chú (nếu có)"
              value={note}
              onChangeText={(text) => setNote(text)}
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddSource}>
            <Text style={styles.addButtonText}>Thêm nguồn tiền</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Phần Hiển Thị Danh Sách Nguồn Tiền */}
      {showSourceList && (
        <FlatList
          data={sources}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={styles.sourceList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có nguồn tiền nào!</Text>
          }
          ListHeaderComponent={
            <Text style={styles.title}>Danh Sách Nguồn Tiền</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sourceList: {
    flex: 1,
    marginTop: 16,
  },
  sourceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sourceAmount: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  sourceNote: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 14,
  },
});

export default App;
