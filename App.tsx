/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import type {Node} from 'react';
import Router from './src/navigation/Router';
import bcrypt from 'react-native-bcrypt';
import { LogBox } from 'react-native';

const database = require('./src/components/Handlers/database.js');

const userTableName = 'users'; 

let salt = bcrypt.genSaltSync(10);

const App: () => Node = () => {
  try {
    database.createHostsTable();
  } catch (error) {
    console.log('Failed to create hosts table ' + error);
  }
  try {
    database.createMeetingsTable();
  } catch (error) {
    console.log('Failed to create meetings table ' + error);
  }
  try {
    database.createHostMeetingsTable();
  } catch (error) {
    console.log('Failed to create host meetings table ' + error);
  }
  try {
    database.createUsersTable();
  } catch (error) {
    console.log('Failed to create users table ' + error);
  }
  return <Router />;
};

LogBox.ignoreLogs(['Math.random']);
export default App;