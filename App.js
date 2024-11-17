import { StatusBar } from 'expo-status-bar';
import { StyleSheet} from 'react-native';
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CollectionScreen from './screens/CollectionScreen';
import CardScreen from './screens/CardScreen';

export default function App() {

  const Stack = createStackNavigator()

  async function createDatabase() {
    const db = await SQLite.openDatabaseAsync('OwnDB')
    await db.execAsync(
      `PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        coverImage TEXT
      );
      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY,
        collectionId INTEGER NOT NULL,
        name TEXT NOT NULL,
        image TEXT,
        state INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (collectionId) REFERENCES collections (id)
      );`);
  }

  useEffect(() => {
    createDatabase()
  }, [])

  return (
    <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#4D0B0A' },
            headerTintColor: '#ffffff',
            contentStyle: { backgroundColor: '#614c4c' },
          }}
        >
          <Stack.Screen
            name="OwnCollection"
            component={CollectionScreen}
            options={{ title: 'OwnCollection' }}
          />
          <Stack.Screen
            name="Collection Name"
            component={CardScreen}
            options={({ route }) => ({
              title: route.params.collectionName || 'Cartas',
            })}
          />
          {/* <Stack.Screen
            name="Card Name"
            component={SelectedCardScreen}
            options={({ route }) => ({
              title: route.params.cardName || 'Detalles de la Carta',
            })}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
