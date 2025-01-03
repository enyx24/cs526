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

const screenWidth = Dimensions.get('window').width;

const About = () => {
  const [activeTopTab, setActiveTopTab] = useState('monthly'); // Hàng Tháng / Hàng Năm
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);

  // Lấy giao dịch từ database và nhóm theo danh mục
  const fetchTransactions = () => {
    getTransactions((data) => {
      const filteredData = filterTransactionsByDate(data, activeTopTab);
      groupTransactionsByCategory(filteredData);
    });
  };

  // Lọc giao dịch theo tháng hoặc năm
  const filterTransactionsByDate = (data, tab) => {
    return data.filter((item) => {
      const transactionDate = new Date(item.date);
      if (tab === 'monthly') {
        return (
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      } else if (tab === 'yearly') {
        return transactionDate.getFullYear() === currentDate.getFullYear();
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
  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  // Chuyển đổi tháng/năm
  const changeDate = (direction) => {
    let newDate = new Date(currentDate);
    if (activeTopTab === 'monthly') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (activeTopTab === 'yearly') {
      newDate.setFullYear(currentDate.getFullYear() + direction);
    }
    setCurrentDate(newDate);
  };

  // Sử dụng useFocusEffect để reload lại dữ liệu khi tab được bấm vào
  useFocusEffect(
    useCallback(() => {
      console.log('Tab focused, reloading data...');
      fetchTransactions();
    }, [activeTopTab, currentDate])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Thanh Tab (Hàng Tháng, Hàng Năm) */}
        <View style={styles.topTabContainer}>
          <TouchableOpacity
            style={[
              styles.topTab,
              activeTopTab === 'monthly' && styles.activeTopTab,
            ]}
            onPress={() => setActiveTopTab('monthly')}
          >
            <Text
              style={[
                styles.topTabText,
                activeTopTab === 'monthly' && styles.activeTopTabText,
              ]}
            >
              Hàng Tháng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.topTab,
              activeTopTab === 'yearly' && styles.activeTopTab,
            ]}
            onPress={() => setActiveTopTab('yearly')}
          >
            <Text
              style={[
                styles.topTabText,
                activeTopTab === 'yearly' && styles.activeTopTabText,
              ]}
            >
              Hàng Năm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Biểu đồ chi tiêu */}
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
                  style={[
                    styles.legendColor,
                    { backgroundColor: category.color },
                  ]}
                />
                <Text style={styles.legendText}>
                  {category.name} ({category.percentage}%):{' '}
                  {category.amount.toLocaleString('vi-VN')}đ
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Biểu đồ thu nhập */}
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
                  style={[
                    styles.legendColor,
                    { backgroundColor: category.color },
                  ]}
                />
                <Text style={styles.legendText}>
                  {category.name} ({category.percentage}%):{' '}
                  {category.amount.toLocaleString('vi-VN')}đ
                </Text>
              </View>
            ))}
          </View>
        </View>
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
  topTabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  topTab: {
    padding: 10,
    marginHorizontal: 5,
  },
  activeTopTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFA500',
  },
  topTabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTopTabText: {
    fontWeight: 'bold',
    color: '#FFA500',
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
