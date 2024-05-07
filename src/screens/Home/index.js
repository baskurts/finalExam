import {View, Text, Pressable, SafeAreaView, TextInput, TouchableOpacity, Alert} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { openDatabase } from 'react-native-sqlite-storage';
import bcrypt from 'react-native-bcrypt';
import React, { useState } from 'react';

const schedulerDB = openDatabase({name: 'Scheduler.db'});

const userTableName = 'users';

const HomeScreen = () => {

  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityTextEntry, setSecurityTextEntry] = useState(true);

  const onIconPress = () => {
    setSecurityTextEntry(!securityTextEntry);
  };

  const onSubmit = async () => {
    if (!fullname || !email || !password) {
      Alert.alert('Invalid Input', 'Fullname, email, and password are required!');
      return;
    }

    schedulerDB.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM ${userTableName} WHERE fullname = "${fullname}" AND email = "${email}"`,
        [],
        (_, res) => {
          let user = res.rows.length;
          if (user == 0){
            Alert.alert('Invalid User', 'Fullname and email are invalid!');
            return;
          } else {
            let item = res.rows.item(0);
            let isPasswordCorrect = bcrypt.compareSync(password, item.password);
            if (!isPasswordCorrect) {
              Alert.alert('Invalid User', 'Password is invalid!');
              return;
            }
            if (user != 0 && isPasswordCorrect) {
              navigation.navigate('Start Scheduling!');
            }
          }
        },
        error => {
          console.log('Error getting user ' + error.message);
        },
      );
    });
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 0.0}} />
      <View style={styles.header}>
        <Text style={styles.title}>
          Scheduler
        </Text>
        <TextInput
            placeholder='Enter Fullname'
            placeholderTextColor='grey'
            value={fullname}
            autoCapitalize='none'
            onChangeText={setFullName}
            style={{
              color: 'black',
              fontSize: 16,
              width: '100%',
              marginVertical: 15,
              borderColor: 'lightgrey',
              borderBottomWidth: 1.0,
              paddingTop: 100,
            }}
          />
          <TextInput
            placeholder='Enter Email'
            placeholderTextColor='grey'
            value={email}
            autoCapitalize='none'
            onChangeText={setEmail}
            style={{
              color: 'black',
              fontSize: 16,
              width: '100%',
              marginVertical: 15,
              borderColor: 'lightgrey',
              borderBottomWidth: 1.0,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              borderBottomWidth: 1.0,
              borderColor: 'lightgrey',
              marginVertical: 15,
            }}
          >
          <TextInput
            placeholder='Enter Password'
            placeholderTextColor='grey'
            value={password}
            autoCapitalize='none'
            onChangeText={setPassword}
            secureTextEntry={securityTextEntry}
            style={{
              color: 'black',
              fontSize: 16,
              width: '100%',
              flex: 1,
            }}
          />
          <TouchableOpacity onPress={onIconPress}>
            {securityTextEntry === true ? (
              <Entypo name="eye" size={20} />
            ) : (
              <Entypo name="eye-with-line" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Pressable
          style={styles.button}
          onPress={() => onSubmit()}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
          <View style={{
            flexDirection: 'row', 
            marginTop: 20, 
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: 16,
            }}>Don't have an account </Text>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
            }}>Sign Up</Text>
          </View>
        </TouchableOpacity>  
    </View>
  );
};

export default HomeScreen;