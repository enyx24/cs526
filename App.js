import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarScreen from './src/screens/CalendarScreen'; // Đường dẫn đến file CalendarScreen
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Nhập vào') {
              iconName = 'pencil-outline';
            } else if (route.name === 'Lịch') {
              iconName = 'calendar-outline';
            } else if (route.name === 'Báo cáo') {
              iconName = 'pie-chart-outline';
            } else if (route.name === 'Khác') {
              iconName = 'ellipsis-horizontal-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FFA500',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Nhập vào" component={HomeScreen} />
        <Tab.Screen name="Lịch" component={CalendarScreen} />
        <Tab.Screen name="Báo cáo" component={AboutScreen} />
        <Tab.Screen name="Khác" component={CalendarScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
