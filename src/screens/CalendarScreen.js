import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import {
  initializeDatabase,
  getTransactions,
  deleteTransaction,
} from '../database/transaction';
import { getSourceIdByName, updateSourceAmount } from '../database/source';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const calculateTotals = (date) => {
    getTransactions((allTransactions) => {
      const filtered = allTransactions.filter(
        (transaction) => transaction.date === date
      );

      let totalIncome = 0;
      let totalExpense = 0;

      filtered.forEach((transaction) => {
        if (transaction.type === 'income') {
          totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
          totalExpense += transaction.amount;
        }
      });

      setIncome(totalIncome);
      setExpense(totalExpense);
      setTransactions(filtered);
      setFilteredTransactions(filtered);
    });
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    calculateTotals(day.dateString);
    setSearchQuery('');
  };

  const handleDeleteTransaction = (id) => {
    const transactionToDelete = transactions.find((t) => t.id === id);
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa giao dịch này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(
              id,
              () => {
                getSourceIdByName(
                  transactionToDelete.source,
                  (sourceData) => {
                    if (sourceData) {
                      const newAmount =
                        transactionToDelete.type === 'income'
                          ? parseInt(sourceData.amount, 10) -
                            parseInt(transactionToDelete.amount, 10)
                          : parseInt(sourceData.amount, 10) +
                            parseInt(transactionToDelete.amount, 10);

                      updateSourceAmount(
                        sourceData.id,
                        newAmount,
                        () => {
                          console.log('Source amount updated');
                        },
                        (error) => {
                          console.error('Error updating source:', error);
                        }
                      );
                    }
                  },
                  (error) => {
                    console.error('Error fetching source:', error);
                  }
                );

                Alert.alert('Thành công', 'Giao dịch đã được xóa');
                calculateTotals(selectedDate);
              },
              (error) => {
                Alert.alert('Lỗi', 'Không thể xóa giao dịch');
                console.error(error);
              }
            );
          },
        },
      ]
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = transactions.filter(
        (transaction) =>
          transaction.note.toLowerCase().includes(lowerCaseQuery) ||
          transaction.source.toLowerCase().includes(lowerCaseQuery) ||
          transaction.category.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredTransactions(filtered);
    }
  };

  useFocusEffect(
    useCallback(() => {
      initializeDatabase();
      if (selectedDate) {
        calculateTotals(selectedDate);
      }
    }, [selectedDate])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch</Text>
      </View>

      <Calendar
        current={new Date().toISOString().split('T')[0]}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#FFA500',
          },
        }}
        onDayPress={onDayPress}
        theme={{
          selectedDayBackgroundColor: '#FFA500',
          todayTextColor: '#FFA500',
          arrowColor: '#FFA500',
          textMonthFontWeight: 'bold',
        }}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Thu nhập</Text>
          <Text style={styles.income}>{income.toLocaleString('vi-VN')}đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Chi tiêu</Text>
          <Text style={styles.expense}>{expense.toLocaleString('vi-VN')}đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng</Text>
          <Text
            style={
              income - expense >= 0 ? styles.totalPositive : styles.totalNegative
            }
          >
            {(income - expense).toLocaleString('vi-VN')}đ
          </Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm giao dịch..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionText}>Ghi chú: {item.note}</Text>
              <Text style={styles.transactionText}>Nguồn: {item.source}</Text>
              <Text style={styles.transactionText}>Danh mục: {item.category}</Text>
            </View>
            <View style={styles.transactionActions}>
              <Text
                style={
                  item.type === 'income' ? styles.income : styles.expense
                }
              >
                {item.amount.toLocaleString('vi-VN')}đ
              </Text>
              <TouchableOpacity onPress={() => handleDeleteTransaction(item.id)}>
                <Text style={styles.deleteButton}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Không có giao dịch nào</Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  income: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expense: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  totalPositive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  totalNegative: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionText: {
    fontSize: 14,
    color: '#333333',
  },
  transactionActions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  deleteButton: {
    marginTop: 8,
    color: '#FF5722',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666666',
  },
});

export default CalendarScreen;
