import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarScreen from './src/screens/CalendarScreen'; 
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
import SourceScreen from './src/screens/SourceScreen';
import OCRButton from './src/components/OCRButton';  // Import OCRButton
import OCRScreen from './src/screens/OCRScreen';

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
            } else if (route.name === 'Nguồn') {
              iconName = 'server-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FFA500',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height: 60 },
        })}
      >
        <Tab.Screen name="Nhập vào" component={HomeScreen} />
        <Tab.Screen name="Lịch" component={CalendarScreen} />
        {/* Custom Tab button for OCRButton */}
        <Tab.Screen
          name="OCR"
          component={OCRScreen}  // Keep a dummy screen for OCR button
          options={{
            tabBarButton: (props) => <OCRButton {...props} />,
            tabBarLabel: '',
            tabBarIcon: () => null, // Don't show any icon
          }}
        />
        <Tab.Screen name="Báo cáo" component={AboutScreen} />
        <Tab.Screen name="Nguồn" component={SourceScreen} />

        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
