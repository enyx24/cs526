import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.title}>Lịch</Text>
      </View>

      {/* Lịch */}
      <Calendar
        current={'2025-01-01'}
        markedDates={{
          '2025-01-01': { marked: true, dotColor: 'orange' },
        }}
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
          <Text style={styles.income}>0đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Chi tiêu</Text>
          <Text style={styles.expense}>0đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng</Text>
          <Text style={styles.total}>+0đ</Text>
        </View>
      </View>
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
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});

export default CalendarScreen;
