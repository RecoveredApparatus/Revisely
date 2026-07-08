import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import DeckScreen from './src/screens/DeckScreen';
import StatsScreen from './src/screens/StatsScreen';
import CardEditorScreen from './src/screens/CardEditorScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AIGeneratorScreen from './src/screens/AIGeneratorScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// The DeckScreen and CardEditor share a stack navigator
function DeckStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeckList" component={DeckScreen} />
      <Stack.Screen name="CardEditor" component={CardEditorScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AIGenerator" component={AIGeneratorScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: '#8b5cf6',
          background: '#0a0c14',
          card: '#06080e',
          text: '#f1f5f9',
          border: 'rgba(255, 255, 255, 0.08)',
          notification: '#8b5cf6',
        },
      }}
    >
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#06080e',
            borderTopColor: 'rgba(255, 255, 255, 0.06)',
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#8b5cf6',
          tabBarInactiveTintColor: '#64748b',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'flash' : 'flash-outline';
            } else if (route.name === 'Decks') {
              iconName = focused ? 'library' : 'library-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            }
            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Revise' }} />
        <Tab.Screen name="Decks" component={DeckStack} options={{ title: 'Library' }} />
        <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Stats' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
