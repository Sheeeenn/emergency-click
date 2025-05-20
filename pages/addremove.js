import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

const windowWidth = Dimensions.get('window').width;

export default function AddRemove() {
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [emails, setEmails] = useState([]);

  const addEmail = () => {
    if (!email.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid email address.');
      return;
    }
    if (emails.includes(email.trim())) {
      Alert.alert('Duplicate', 'Email already added.');
      return;
    }
    setEmails(prev => [...prev, email.trim()]);
    setEmail('');
  };

  const removeEmail = (item) => {
    Alert.alert(
      'Remove Email',
      `Remove ${item}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setEmails(prev => prev.filter(e => e !== item));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filteredEmails = emails.filter(email =>
    email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>MANAGE CONTACTS</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#999"
            returnKeyType="done"
            onSubmitEditing={addEmail}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addEmail}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={28} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search emails"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#999"
        />

        {filteredEmails.length === 0 ? (
          <Text style={styles.emptyText}>No emails added yet.</Text>
        ) : (
          filteredEmails.map(item => (
            <View key={item} style={styles.listItem}>
              <Text style={styles.listItemText}>{item}</Text>
              <TouchableOpacity
                onPress={() => removeEmail(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="remove-circle" size={26} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))
        )}

      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111B2E',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 120, // safe space for bottom nav
    paddingHorizontal: 20,
    maxWidth: 450,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontWeight: '900',
    fontSize: 30,
    color: '#F0F0F0',
    letterSpacing: 3,
    marginBottom: 25,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#1B263B',
    borderColor: '#FF3B30',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#F0F0F0',
    marginRight: 12,
    minWidth: 0, // fix flex shrinking issues on Android
  },
  addButton: {
    borderColor: '#FF3B30',
    borderWidth: 2,
    borderRadius: 18,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#1B263B',
    borderColor: '#FF3B30',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#F0F0F0',
    marginBottom: 20,
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#17223B',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
    width: '100%',
  },
  listItemText: {
    color: '#F0F0F0',
    fontSize: 16,
    flexShrink: 1,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 50,
    fontSize: 16,
    textAlign: 'center',
  },
});
