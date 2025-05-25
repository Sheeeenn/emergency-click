import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const navigation = useNavigation();
  const [confirmPassword, setConfirmPassword] = useState('');
const [passwordVisible, setPasswordVisible] = useState(false);
const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  // Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // For pulse animation on icon
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // For moving glowing circle
  const position = useRef(new Animated.ValueXY({ x: 50, y: 50 })).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const corners = [
    { x: 50, y: 50 },
    { x: SCREEN_WIDTH - 150, y: 50 },
    { x: SCREEN_WIDTH - 150, y: SCREEN_HEIGHT - 150 },
    { x: 50, y: SCREEN_HEIGHT - 150 },
  ];

  // Pulse animation loop for icon
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Animate moving glowing circle around corners continuously
  useEffect(() => {
    let cornerIndex = 0;

    const animate = () => {
      const nextIndex = (cornerIndex + 1) % corners.length;

      Animated.parallel([
        Animated.timing(position, {
          toValue: { x: corners[nextIndex].x, y: corners[nextIndex].y },
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(rotation, {
          toValue: rotation._value + 360,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start(() => {
        cornerIndex = nextIndex;
        animate();
      });
    };

    animate();

    return () => {
      position.stopAnimation();
      rotation.stopAnimation();
    };
  }, [position, rotation, corners]);

  // Interpolations for pulse
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  // Interpolation for rotation
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  // Handle Signin button press validations
  const handleSignIn = async () => {

        if (!emailRegex.test(email)) {
            Alert.alert('Invalid email format');
            console.log('Invalid email format');
            return;
        }

        if (!passwordRegex.test(password)) {
            Alert.alert('Password must be at least 8 characters long and contain at least one letter and one number');
            console.log('Password must be at least 8 characters long and contain at least one letter and one number');
            return;
        }

        if (age != '' && (isNaN(age) || age < 0 || age > 120)) {
            Alert.alert('Please enter a valid age');
            console.log('Please enter a valid age');
            return;
        }
if (password !== confirmPassword) {
  Alert.alert('Passwords do not match');
  return;
}

        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(firestore, 'users', email), {
                username,
                email,
                age,
                contactPerson: '',
            });
            Alert.alert('Signup successful!');
            navigation.navigate('Login');
        }catch (error) {
            console.error('Error signing in:', error);
            Alert.alert('Error signing in:', error.message);
        }
        
        console.log('Sign in with:', { email, password, username });
    }
    


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Moving glowing circle behind everything */}
      <Animated.View
        style={[
          styles.movingCircle,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '120%', alignItems: 'flex-start', marginBottom: 0 }}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.navigate('Login')}
  >
    <Icon name="log-out" size={18} color="#FF3B30" style={{ marginRight: 6 }} />
    <Text style={styles.backButtonText}>Back</Text>
  </TouchableOpacity>
</View>

        {/* Icon with pulse */}
        <View style={styles.pulseWrapper}>
  <Animated.View
    style={[
      styles.pulseCrircle,
      {
        opacity: pulseOpacity,
        transform: [{ scale: pulseScale }],
      },
    ]}
  />
  <Animated.Image
    source={require('./assets/iconcc.png')}
    style={[styles.logo, { transform: [{ scale: pulseScale }] }]}
    resizeMode="contain"
  />
</View>

        {/* Title */}
        <Text style={styles.title}>SIGN IN</Text>


        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Enter your Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
<TextInput
          style={styles.input}
          placeholder="Enter your Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
        
        <View style={{ width: '100%', marginBottom: -1 }}>
  <TextInput
    style={styles.input}
    placeholder="Enter your Password"
    placeholderTextColor="#999"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!passwordVisible}
    autoCapitalize="none"
    autoCorrect={false}
    returnKeyType="next"
  />
  <TouchableOpacity
    onPress={() => setPasswordVisible(!passwordVisible)}
    style={{ position: 'absolute', right: 20, top: 18 }}
  >
    <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={22} color="#999" />
  </TouchableOpacity>
</View>

<View style={{ width: '100%', marginBottom: -1 }}>
  <TextInput
    style={styles.input}
    placeholder="Confirm Password"
    placeholderTextColor="#999"
    value={confirmPassword}
    onChangeText={setConfirmPassword}
    secureTextEntry={!confirmPasswordVisible}
    autoCapitalize="none"
    autoCorrect={false}
    returnKeyType="done"
  />
  <TouchableOpacity
    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
    style={{ position: 'absolute', right: 20, top: 18 }}
  >
    <Icon
      name={confirmPasswordVisible ? 'eye' : 'eye-off'}
      size={22}
      color="#999"
    />
  </TouchableOpacity>
  </View>
         <TextInput
          style={styles.input}
          placeholder="Enter your Age"
          placeholderTextColor="#999"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          returnKeyType="done"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSignIn}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        
        
      </ScrollView>
    </SafeAreaView>
  );
}

const CIRCLE_SIZE = 140;
const MAX_WIDTH = 420;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111B2E',
    flexDirection: 'row',
    justifyContent: 'flex-start'

  },
    backButton: {
  flexDirection: 'row', // NEW
  alignItems: 'center', // NEW
  alignSelf: 'flex-start',
  marginBottom: -10,
  paddingVertical: 4,
  paddingHorizontal: 6,
  backgroundColor: '#1B263B',
  borderRadius: 6,
  borderColor: '#FF3B30',
  borderWidth: 1,
},

backButtonText: {
  color: '#FF3B30',
  fontSize: 14,
  fontWeight: 'bold',
},
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: MAX_WIDTH,
  },
  
  movingCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#FF3B30',
    opacity: 0.3,
    zIndex: -1,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  pulseWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 4,
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    backgroundColor: 'transparent',
    elevation: 6,
  },
  logo: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  title: {
    fontWeight: '900',
    fontSize: 32,
    color: '#F0F0F0',
    letterSpacing: 3,
    marginBottom: 35,
    textAlign: 'center',
    textShadowColor: 'rgba(255,59,48,0.5)',
    textShadowOffset: { width: 0, hright: 2 },
    textShadowRadius: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#1B263B',
    borderColor: '#FF3B30',
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 17,
    color: '#F0F0F0',
    marginBottom: 20,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButton: {
    width: '50%',
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  
});
