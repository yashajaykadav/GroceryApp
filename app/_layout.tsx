import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";
import { CartProvider } from './context/CartContext';


import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
      <Stack initialRouteName='login'>
        <Stack.Screen name = "login" options={{headerShown:false}}/>
        <Stack.Screen name = "(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name = "modal" options={{presentation:'modal',title:'Modal'}}/>
       
      </Stack>
      </CartProvider>
      <Toast />
    
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
