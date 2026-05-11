import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getTransactions } from '../database/transaction';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const screenWidth = Dimensions.get('window').width;

const About = () => {
  const [startDate, setStartDate] = useState(null); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(null); // Ngày kết thúc
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);

  // Lấy giao dịch từ database và nhóm theo danh mục
  const fetchTransactions = () => {
    getTransactions((data) => {
      const filteredData = filterTransactionsByDate(data);
      groupTransactionsByCategory(filteredData);
    });
  };

  // Lọc giao dịch theo khoảng thời gian
  const filterTransactionsByDate = (data) => {
    return data.filter((item) => {
      const transactionDate = new Date(item.date);
      if (startDate && endDate) {
        return transactionDate >= startDate && transactionDate <= endDate;
      }
      return false;
    });
  };

  // Nhóm giao dịch theo danh mục
  const groupTransactionsByCategory = (data) => {
    const expenseCategories = {};
    const incomeCategories = {};
    let totalExpense = 0;
    let totalIncome = 0;

    data.forEach((item) => {
      const { category, type, amount } = item;

      if (type === 'expense') {
        totalExpense += parseFloat(amount);
        if (!expenseCategories[category]) {
          expenseCategories[category] = 0;
        }
        expenseCategories[category] += parseFloat(amount);
      } else if (type === 'income') {
        totalIncome += parseFloat(amount);
        if (!incomeCategories[category]) {
          incomeCategories[category] = 0;
        }
        incomeCategories[category] += parseFloat(amount);
      }
    });

    setExpenseCategories(
      Object.keys(expenseCategories).map((key) => ({
        name: key,
        amount: expenseCategories[key],
        color: getRandomColor(),
        percentage: ((expenseCategories[key] / totalExpense) * 100).toFixed(2),
      }))
    );

    setIncomeCategories(
      Object.keys(incomeCategories).map((key) => ({
        name: key,
        amount: incomeCategories[key],
        color: getRandomColor(),
        percentage: ((incomeCategories[key] / totalIncome) * 100).toFixed(2),
      }))
    );
  };

  // Hàm tạo màu ngẫu nhiên
  const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  // Sử dụng useFocusEffect để reload lại dữ liệu khi tab được bấm vào
  useFocusEffect(
    useCallback(() => {
      if (startDate && endDate) {
        fetchTransactions();
      }
    }, [startDate, endDate])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Bộ chọn khoảng thời gian */}
        <View style={styles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.dateText}>
              {startDate ? `Từ: ${startDate.toLocaleDateString('vi-VN')}` : 'Chọn ngày bắt đầu'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateText}>
              {endDate ? `Đến: ${endDate.toLocaleDateString('vi-VN')}` : 'Chọn ngày kết thúc'}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}

        {/* Biểu đồ chi tiêu */}
        {startDate && endDate && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Biểu đồ Chi Tiêu Theo Danh Mục</Text>
            <PieChart
              data={expenseCategories}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={false}
            />
            <View style={styles.legendContainer}>
              {expenseCategories.map((category, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: category.color }]}
                  />
                  <Text style={styles.legendText}>
                    {category.name} ({category.percentage}%):{' '}
                    {category.amount.toLocaleString('vi-VN')}đ
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Biểu đồ thu nhập */}
        {startDate && endDate && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Biểu đồ Thu Nhập Theo Danh Mục</Text>
            <PieChart
              data={incomeCategories}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={false}
            />
            <View style={styles.legendContainer}>
              {incomeCategories.map((category, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: category.color }]}
                  />
                  <Text style={styles.legendText}>
                    {category.name} ({category.percentage}%):{' '}
                    {category.amount.toLocaleString('vi-VN')}đ
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 4,
  },
  chartContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});

export default About;
