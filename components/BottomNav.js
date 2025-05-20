import React from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav() {
  const navigation = useNavigation();

  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => navigation.navigate('Login'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.bottomNav}>
      <Pressable
        onPress={() => navigation.navigate('Home')}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }]}
        android_ripple={{ color: '#FF3B30' }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="home-outline" size={32} color="#FF3B30" />
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('AddRemove')}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }]}
        android_ripple={{ color: '#FF3B30' }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="people-outline" size={32} color="#FF3B30" />
      </Pressable>

      {/* Sign Out Button with confirmation */}
      <Pressable
        onPress={confirmLogout}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }]}
        android_ripple={{ color: '#FF3B30' }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="log-out-outline" size={32} color="#FF3B30" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    height: 80,
    backgroundColor: '#0F1A2B',
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-around', // Keeps buttons spaced evenly
    alignItems: 'center',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
    zIndex: 100,
  },
  button: {
    padding: 12,
    borderRadius: 24,
  },
});
