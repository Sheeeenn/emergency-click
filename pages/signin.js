import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Signin() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');

    const navigation = useNavigation();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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

        try{
            const  userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, 'users', userCredentials.user.uid), {
                username: username,
                email: email,
                password: password,
                contactPerson: ''
            });
        }catch (error) {
            console.error('Error signing in:', error);
            Alert.alert('Error signing in:', error.message);
        }
        
        console.log('Sign in with:', { email, password, username });
    }

    return (
        <View style={styles.container}>
            <Text>Welcome to the Signin Page</Text>
            <TextInput
                placeholder="Enter your Username"
                value={username}
                onChangeText={setUsername}
                keyboardType='default'
            />

            <TextInput
                placeholder="Enter your Email"
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
            />

            <TextInput
                placeholder="Enter your Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <TouchableOpacity onPress={handleSignIn}>
                <Text>Submit</Text>
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