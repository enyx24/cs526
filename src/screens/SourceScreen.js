import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const App = () => {
  const [name, setName] = useState(''); // Tên nguồn tiền
  const [amount, setAmount] = useState(''); // Số tiền
  const [note, setNote] = useState(''); // Ghi chú
  const [sources, setSources] = useState([]); // Danh sách nguồn tiền

  // Hàm thêm nguồn tiền
  const addSource = () => {
    if (!name || !amount) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newSource = {
      id: Math.random().toString(), // ID ngẫu nhiên
      name,
      amount: parseFloat(amount).toLocaleString() + ' đ', // Định dạng số tiền
      note,
    };

    setSources([...sources, newSource]); // Thêm vào danh sách
    setName('');
    setAmount('');
    setNote('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Phần Tạo Nguồn Tiền */}
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

        <TouchableOpacity style={styles.addButton} onPress={addSource}>
          <Text style={styles.addButtonText}>Thêm nguồn tiền</Text>
        </TouchableOpacity>
      </View>

      {/* Phần Hiển Thị Danh Sách Nguồn Tiền */}
      <View style={styles.listSection}>
        <Text style={styles.title}>Danh Sách Nguồn Tiền</Text>

        <FlatList
          data={sources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.sourceItem}>
              <Text style={styles.sourceName}>{item.name}</Text>
              <Text style={styles.sourceAmount}>{item.amount}</Text>
              {item.note ? <Text style={styles.sourceNote}>{item.note}</Text> : null}
            </View>
          )}
          style={styles.sourceList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có nguồn tiền nào!</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  createSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listSection: {
    flex: 1,
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 14,
  },
});

export default App;
