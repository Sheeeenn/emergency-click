import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';


export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = React.useState(false);


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const pulseAnim = useRef(new Animated.Value(0)).current;

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

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  const handleLogin = () => {
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid email format');
      return;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert('Password must be at least 8 characters with a number and letter');
      return;
    }
    console.log('Logging in with:', { email, password });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Container to stack circle behind logo */}
        <View style={styles.logoContainer}>
          {/* Pulsing Circle behind */}
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          />

          {/* Logo */}
          <Animated.Image
            source={require('./assets/iconcc.png')}
            style={[styles.logo, { transform: [{ scale: pulseScale }] }]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.appName}>ClickChain</Text>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#BBB"
          selectionColor="#FF3B30"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#BBB"
            selectionColor="#FF3B30"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(prev => !prev)}
          >
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color="#FF3B30"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotWrapper}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const CIRCLE_SIZE = 140;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111B2E',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
  },
  logoContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative', // this allows layering
  },
  pulseCircle: {
    position: 'absolute', // absolutely positioned inside logoContainer
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
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F0F0F0',
    letterSpacing: 3,
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(255,59,48,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginBottom: 35,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#F0F0F0',
  },
  signUpLink: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '700',
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
  forgotWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  forgotText: {
    color: '#FF3B30',
    fontSize: 13.5,
    fontWeight: '600',
  },
  loginButton: {
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
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  passwordContainer: {
  width: '100%',
  position: 'relative',
  marginBottom: 20,
},
eyeIcon: {
  position: 'absolute',
  right: 20,
  top: 18,
},

});

