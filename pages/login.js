import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const navigation = useNavigation();

  const handleLogin = async () => {
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

    // Add your login logic here
    console.log('Login with:', { email, password });
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to the Login Page</Text>

      {/* email */}
      <TextInput
        placeholder="Enter your Email"
        value={email}
        onChangeText={setEmail}
        secureTextEntry={true}
      />

      {/* password */}
      <TextInput
        placeholder="Enter your Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* login button */}
      <TouchableOpacity onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>

      {/* sign up */}
      <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
        <Text>Sign Up</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
