import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useFocusEffect } from '@react-navigation/native';
import {
  createTable,
  addSource,
  loadSources,
  deleteSource,
  transferAmount,
  getSourceNameById
} from '../database/source';
import {
  createTransferTable,
  addTransfer,
  getTransfers,
} from '../database/transfer';

const SourceScreen = () => {
  const [selectedSource, setSelectedSource] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sources, setSources] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [showCreateSource, setShowCreateSource] = useState(true);
  const [showSourceList, setShowSourceList] = useState(false);
  const [showTransferSection, setShowTransferSection] = useState(false);
  const [fromSource, setFromSource] = useState(null);
  const [toSource, setToSource] = useState(null);
  const [transferAmountValue, setTransferAmountValue] = useState('');

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

  useEffect(() => {
    createTable();
    createTransferTable();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSourcesList();
      loadTransfers();
    }, [])
  );

  const loadSourcesList = () => {
    loadSources(setSources);
  };

  const loadTransfers = () => {
    getTransfers(setTransfers);
  };

  const availableSourceOptions = sourceOptions.filter(
    (option) => !sources.some((source) => source.name === option.value)
  );

  const handleAddSource = () => {
    if (!selectedSource || !amount) {
      Alert.alert('Lỗi', 'Vui lòng chọn nguồn tiền và nhập số tiền!');
      return;
    }

    addSource(selectedSource, parseInt(amount, 10), note, () => {
      loadSourcesList();
      Alert.alert('Thành công', 'Nguồn tiền đã được thêm thành công!', [{ text: 'OK' }]);
    });

    setSelectedSource('');
    setAmount('');
    setNote('');
  };

  const handleDeleteSource = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa nguồn tiền này không?',
      [
        { text: 'Hủy', style: 'cancel' },
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

  const handleTransfer = () => {
    if (!fromSource || !toSource || !transferAmountValue) {
      Alert.alert('Lỗi', 'Vui lòng chọn nguồn tiền và nhập số tiền!');
      return;
    }

    if (fromSource === toSource) {
      Alert.alert('Lỗi', 'Nguồn gốc và nguồn đích không thể giống nhau!');
      return;
    }

    const amount = parseInt(transferAmountValue, 10);

    transferAmount(fromSource, toSource, amount, (success) => {
      if (success) {
        addTransfer(fromSource, toSource, amount, () => {
          loadTransfers();
          Alert.alert('Thành công', 'Chuyển tiền thành công!', [{ text: 'OK' }]);
        });
      } else {
        Alert.alert('Lỗi', 'Chuyển tiền thất bại! Kiểm tra số dư.');
      }
    });

    setFromSource(null);
    setToSource(null);
    setTransferAmountValue('');
  };

  // const getSourceNameById = (id) => {
  //   const source = sources.find((s) => s.id === id);
  //   return source ? source.name : 'Không xác định';
  // };

  return (
    <SafeAreaView style={styles.container}>
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

      {showCreateSource && (
        <View style={styles.createSection}>
          <Text style={styles.title}>Tạo Nguồn Tiền</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nguồn tiền</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedSource(value)}
              items={availableSourceOptions}
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

      {showSourceList && (
        <FlatList
          data={sources}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.sourceItem}>
              <Text style={styles.sourceName}>{item.name}</Text>
              <Text style={styles.sourceAmount}>{item.amount.toLocaleString('vi-VN')}đ</Text>
              {item.note && <Text style={styles.sourceNote}>{item.note}</Text>}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSource(item.id)}
              >
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.sourceList}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có nguồn tiền nào!</Text>}
          ListHeaderComponent={<Text style={styles.title}>Danh Sách Nguồn Tiền</Text>}
        />
      )}

      {showTransferSection && (
        <ScrollView style={styles.scrollView}>
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

            <Text style={styles.title}>Lịch Sử Chuyển Tiền</Text>
            {transfers.map((item) => (
              <View key={item.id} style={styles.transferItem}>
                <Text style={styles.transferText}>
                  {getSourceNameById(item.fromSource)} → {getSourceNameById(item.toSource)}
                </Text>
                <Text style={styles.transferAmount}>
                  {item.amount.toLocaleString('vi-VN')}đ
                </Text>
                <Text style={styles.transferDate}>
                  {new Date(item.transferDate).toLocaleString('vi-VN')}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
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
  transferItem: {
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
  transferText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transferAmount: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  transferDate: {
    fontSize: 12,
    color: '#666',
  },
  scrollView: {
    marginTop: 16,
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

export default SourceScreen;
