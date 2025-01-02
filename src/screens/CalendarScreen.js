import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { initializeDatabase, getTransactions } from '../database/transaction';
import { loadAllCategories } from '../database/category';
const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [categories, setCategories] = useState({}); // Lưu tên danh mục
  useEffect(() => {
    initializeDatabase();
  }, []);
  useEffect(() => {
    initializeDatabase();
    loadAllCategories(setCategories); // Tải tất cả tên danh mục
  }, []);
  // Hàm tính tổng thu nhập và chi tiêu theo ngày
  const calculateTotals = (date) => {
    getTransactions((allTransactions) => {
      const filteredTransactions = allTransactions.filter(
        (transaction) => transaction.date === date
      );

      let totalIncome = 0;
      let totalExpense = 0;

      filteredTransactions.forEach((transaction) => {
        if (transaction.type === 'income') {
          totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
          totalExpense += transaction.amount;
        }
      });

      setIncome(totalIncome);
      setExpense(totalExpense);
      setTransactions(filteredTransactions);
    });
  };

  // Hàm xử lý khi ngày được chọn
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    calculateTotals(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.title}>Lịch</Text>
      </View>

      {/* Lịch */}
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

      {/* Tóm tắt thu nhập và chi tiêu */}
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
            style={income - expense >= 0 ? styles.totalPositive : styles.totalNegative}
          >
            {(income - expense).toLocaleString('vi-VN')}đ
          </Text>
        </View>
      </View>

      {/* Danh sách giao dịch */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionText}>Ghi chú: {item.note}</Text>
              <Text style={styles.transactionText}>Nguồn: {item.source}</Text>
              <Text style={styles.transactionText}>Danh mục: {categories[item.category] || 'Không rõ'}</Text>
            </View>
            <Text
              style={
                item.type === 'income'
                  ? styles.income
                  : styles.expense
              }
            >
              {item.amount.toLocaleString('vi-VN')}đ
            </Text>
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
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666666',
  },
});

export default CalendarScreen;
