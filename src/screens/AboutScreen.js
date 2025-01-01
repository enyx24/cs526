import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

const App = () => {
  const [activeTopTab, setActiveTopTab] = useState('monthly'); // Quản lý tab Hàng Tháng/Hàng Năm
  const [activeBottomTab, setActiveBottomTab] = useState('Chi tiêu'); // Quản lý tab Chi tiêu/Thu nhập

  return (
    <SafeAreaView style={styles.container}>
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

      {/* Hiển thị tháng */}
      <View style={styles.dateContainer}>
        <TouchableOpacity>
          <Text style={styles.arrow}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.monthDisplay}>
          <Text style={styles.monthText}>01/2025 (01/01–31/01)</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tóm tắt thu chi */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Chi tiêu</Text>
          <Text style={styles.expenseText}>-0đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Thu nhập</Text>
          <Text style={styles.incomeText}>+0đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Thu chi</Text>
          <Text style={styles.totalText}>+0đ</Text>
        </View>
      </View>

      {/* Thanh chuyển đổi Chi tiêu/Thu nhập */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          style={[
            styles.bottomTab,
            activeBottomTab === 'Chi tiêu' && styles.activeBottomTab,
          ]}
          onPress={() => setActiveBottomTab('Chi tiêu')}
        >
          <Text
            style={[
              styles.bottomTabText,
              activeBottomTab === 'Chi tiêu' && styles.activeBottomTabText,
            ]}
          >
            Chi tiêu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bottomTab,
            activeBottomTab === 'Thu nhập' && styles.activeBottomTab,
          ]}
          onPress={() => setActiveBottomTab('Thu nhập')}
        >
          <Text
            style={[
              styles.bottomTabText,
              activeBottomTab === 'Thu nhập' && styles.activeBottomTabText,
            ]}
          >
            Thu nhập
          </Text>
        </TouchableOpacity>
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
  topTabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  topTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 8,
  },
  activeTopTab: {
    backgroundColor: '#FFA500',
  },
  topTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeTopTabText: {
    color: '#FFF',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 10,
  },
  monthDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expenseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  incomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  bottomTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
    paddingVertical: 8,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeBottomTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFA500',
  },
  bottomTabText: {
    fontSize: 16,
    color: '#666',
  },
  activeBottomTabText: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default App;
