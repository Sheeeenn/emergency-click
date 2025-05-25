import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import * as Location from 'expo-location';
import BottomNav from '../components/BottomNav';

import MapScreen from '../components/map';
import MapView from 'react-native-maps';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 140;

export default function Home() {
  const [locationText, setLocationText] = useState('Waiting for emergency click...');
  const [dateTime, setDateTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationText('Permission denied');
      setDateTime(null);
      setLoading(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const timestamp = new Date();

      setLocationText(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
      setDateTime(timestamp.toLocaleString());
    } catch (error) {
      setLocationText('Error fetching location');
      setDateTime(null);
    }
    setLoading(false);
  }, []);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pulseWrapper} pointerEvents="none">
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        />
        <View style={styles.innerCircle} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('./assets/iconcc.png')} style={styles.icon} />
          <Text style={styles.appName}>ClickChain</Text>
        </View>

        <View style={[styles.sectionContainer, styles.mapHeight]}>
          <Text style={styles.sectionTitle}>LOCATION</Text>
          <MapScreen />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>UPDATED</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{dateTime || '--/--/---- --:-- --'}</Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              loading && styles.buttonDisabled,
              pressed && !loading ? { opacity: 0.7 } : null,
            ]}
            onPress={fetchLocation}
            disabled={loading}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            android_ripple={{ color: '#FF3B30' }}
          >
            <Text style={styles.buttonText}>{loading ? 'Fetching...' : 'Update Location'}</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Remove navigation prop here */}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111B2E',
    paddingBottom: 90, // added padding to avoid bottom nav overlap
  },
  pulseWrapper: {
    position: 'absolute',
    top: 80,
    left: width / 2 - CIRCLE_SIZE / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  pulseCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 4,
    borderColor: '#FF3B30',
    backgroundColor: 'transparent',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  innerCircle: {
    width: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE / 2,
    borderRadius: CIRCLE_SIZE / 4,
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 220,
    paddingBottom: 80,
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#FF3B30',
    paddingBottom: 8,
  },
  mapHeight:{
    height: 300,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F0F0F0',
    letterSpacing: 2,
  },
  sectionContainer: {
    marginBottom: 25,
    width: '100%',
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#F0F0F0',
    marginBottom: 12,
    letterSpacing: 1,
  },
  infoBox: {
    borderWidth: 2,
    borderColor: '#FF3B30',
    borderRadius: 16,
    padding: 22,
    backgroundColor: '#1B263B',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#F0F0F0',
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#FFF',
    marginHorizontal: 60,
  },
  buttonDisabled: {
    backgroundColor: '#8B0000',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 27, 46, 0.6)',
    zIndex: 10,
  },
});
