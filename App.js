import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import màn hình
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';

// Khởi tạo Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline'; // Icon cho tab Home
            } else if (route.name === 'About') {
              iconName = 'information-circle-outline'; // Icon cho tab About
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FFA500', // Màu khi tab được chọn
          tabBarInactiveTintColor: 'gray',  // Màu khi tab không được chọn
          headerShown: false,               // Ẩn tiêu đề của từng màn hình
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Thống kê" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
