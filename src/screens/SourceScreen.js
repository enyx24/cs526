import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {
  createTable,
  addSource,
  loadSources,
  deleteSource,
  transferAmount,
} from '../database/source';

const App = () => {
  const [selectedSource, setSelectedSource] = useState(''); // Nguồn tiền được chọn
  const [amount, setAmount] = useState(''); // Số tiền
  const [note, setNote] = useState(''); // Ghi chú
  const [sources, setSources] = useState([]); // Danh sách nguồn tiền
  const [showCreateSource, setShowCreateSource] = useState(true); // Điều khiển màn hình tạo nguồn tiền
  const [showSourceList, setShowSourceList] = useState(false); // Điều khiển màn hình danh sách nguồn tiền
  const [showTransferSection, setShowTransferSection] = useState(false); // Điều khiển màn hình chuyển tiền
  const [fromSource, setFromSource] = useState(null); // Nguồn gốc
  const [toSource, setToSource] = useState(null); // Nguồn đích
  const [transferAmountValue, setTransferAmountValue] = useState(''); // Số tiền chuyển

  // Danh sách ngân hàng/ví điện tử cố định
  const sourceOptions = [
    { label: 'MoMo', value: 'MoMo' },
    { label: 'Tiền mặt', value: 'Tiền mặt' },
    { label: 'Techcombank', value: 'Techcombank' },
    { label: 'ACB', value: 'ACB' },
    { label: 'Vietcombank', value: 'Vietcombank' },
    { label: 'Agribank', value: 'Agribank' },
    { label: 'Sacombank', value: 'Sacombank' },
    { label: 'BIDV', value: 'BIDV' },
    { label: 'MB', value: 'MB' },
    { label: 'HDBank', value: 'HDBank' },
    { label: 'VietinBank', value: 'VietinBank' },
  ];

  // Tạo bảng khi lần đầu tiên sử dụng ứng dụng
  useEffect(() => {
    createTable();
  }, []);

  // Hàm thêm nguồn tiền
  const handleAddSource = () => {
    if (!selectedSource || !amount) {
      alert('Vui lòng chọn nguồn tiền và nhập số tiền!');
      return;
    }

    addSource(selectedSource, parseInt(amount, 10), note, () => {
      loadSourcesList();
    });

    setSelectedSource('');
    setAmount('');
    setNote('');
  };

  // Tải danh sách nguồn tiền
  const loadSourcesList = () => {
    loadSources(setSources);
  };

  // Hàm xóa nguồn tiền
  const handleDeleteSource = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa nguồn tiền này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: () => {
            deleteSource(id, () => {
              loadSourcesList();
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Hàm chuyển tiền giữa các nguồn tiền
  const handleTransfer = () => {
    if (!fromSource || !toSource || !transferAmountValue) {
      alert('Vui lòng chọn nguồn tiền và nhập số tiền!');
      return;
    }

    if (fromSource === toSource) {
      alert('Nguồn gốc và nguồn đích không thể giống nhau!');
      return;
    }

    const amount = parseInt(transferAmountValue, 10);

    transferAmount(fromSource, toSource, amount, (success) => {
      if (success) {
        alert('Chuyển tiền thành công!');
        loadSourcesList();
      } else {
        alert('Chuyển tiền thất bại! Kiểm tra số dư.');
      }
    });

    setFromSource(null);
    setToSource(null);
    setTransferAmountValue('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.sourceItem}>
      <Text style={styles.sourceName}>{item.name}</Text>
      <Text style={styles.sourceAmount}>{item.amount.toLocaleString('vi-VN')}đ</Text>
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
            setShowTransferSection(false);
          }}
        >
          <Text style={styles.buttonText}>Tạo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, showSourceList && styles.activeButton]}
          onPress={() => {
            setShowCreateSource(false);
            setShowSourceList(true);
            setShowTransferSection(false);
            loadSourcesList();
          }}
        >
          <Text style={styles.buttonText}>Danh Sách</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, showTransferSection && styles.activeButton]}
          onPress={() => {
            setShowCreateSource(false);
            setShowSourceList(false);
            setShowTransferSection(true);
          }}
        >
          <Text style={styles.buttonText}>Chuyển Tiền</Text>
        </TouchableOpacity>
      </View>

      {/* Phần Tạo Nguồn Tiền */}
      {showCreateSource && (
        <View style={styles.createSection}>
          <Text style={styles.title}>Tạo Nguồn Tiền</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nguồn tiền</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedSource(value)}
              items={sourceOptions}
              placeholder={{ label: 'Chọn nguồn tiền', value: '' }}
              style={pickerSelectStyles}
              value={selectedSource}
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
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có nguồn tiền nào!</Text>}
          ListHeaderComponent={<Text style={styles.title}>Danh Sách Nguồn Tiền</Text>}
        />
      )}

      {/* Phần Chuyển Tiền */}
      {showTransferSection && (
        <View style={styles.createSection}>
          <Text style={styles.title}>Chuyển Tiền</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nguồn gốc</Text>
            <RNPickerSelect
              onValueChange={(value) => setFromSource(value)}
              items={sources.map((source) => ({ label: source.name, value: source.id }))}
              placeholder={{ label: 'Chọn nguồn gốc', value: null }}
              style={pickerSelectStyles}
              value={fromSource}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nguồn đích</Text>
            <RNPickerSelect
              onValueChange={(value) => setToSource(value)}
              items={sources.map((source) => ({ label: source.name, value: source.id }))}
              placeholder={{ label: 'Chọn nguồn đích', value: null }}
              style={pickerSelectStyles}
              value={toSource}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số tiền</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số tiền"
              keyboardType="numeric"
              value={transferAmountValue}
              onChangeText={(text) => setTransferAmountValue(text)}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleTransfer}>
            <Text style={styles.addButtonText}>Chuyển Tiền</Text>
          </TouchableOpacity>
        </View>
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#000',
    marginBottom: 8,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#000',
    marginBottom: 8,
  },
});

export default App;
