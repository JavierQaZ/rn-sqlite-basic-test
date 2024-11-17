import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {

  const Stack = createStackNavigator()

  const [collections, setCollections] = useState([])
  const [collectionID, setCollectionID] = useState('')
  const [collectionName, setCollectionName] = useState('')
  const [collectionImageUri, setCollectionImageUri] = useState('')

  const [cards, setCards] = useState([])
  const [cardID, setCardID] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardImageUri, setCardImageUri] = useState('')
  const [cardState, setCardState] = useState('')

  const [refresh, setRefresh] = useState(false)

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

  const insertCollection = async () => {
    const db = await SQLite.openDatabaseAsync('OwnDB');
    const result = await db.runAsync(`INSERT INTO collections (name, coverImage) VALUES (?, ?)`, collectionName, collectionImageUri)
    setRefresh(!refresh)
  }

  const insertCard = async () => {
    const db = await SQLite.openDatabaseAsync('OwnDB');
    const result= await db.runAsync(`INSERT INTO cards (id, collectionId, name, image, state) VALUES (?, ?, ?, ?, ?)`, cardID, collectionID, cardName, cardImageUri, cardState ? 1 : 0)
  }

  const getCollections = async () => {
    const db = await SQLite.openDatabaseAsync('OwnDB')
    const allCollections = await db.getAllAsync(`SELECT * FROM collections`)
    setCollections(allCollections)
  }

  const handleCollectionName = (e) => {
    setCollectionName(e)
  }
  const handleCollectionImageUri = (e) => {
    setCollectionImageUri(e)
  }

  const handleCardID = (e) => {
    setCardID(e)
  }

  const handleCardName = (e) => {
    setCardName(e)
  }
  const handleCardImageUri = (e) => {
    setCardImageUri(e)
  }
  const handleCardState = (e) => {
    setCardState(e)
  }

  useEffect(() => {
    createDatabase()
    getCollections()
  }, [])

  useEffect(() => {
    getCollections()
  }, [refresh])

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>NOMBRE</Text>
      <TextInput
        onChangeText={(e) => handleCollectionName(e)}/>
      <Text>IMAGE</Text>
      <TextInput
        onChangeText={(e) => handleCollectionImageUri(e)}/>

      <TouchableOpacity onPress={insertCollection}>
        <Text>Añadir Collecion</Text>
      </TouchableOpacity>

      <View>
        <Text>Collections:</Text>
        {collections.map((e) => {
          return (
            <View key = {e.id}>
              <Text> Name: {e.name} </Text>
              <Text> ImageUri: {e.coverImage} </Text>
            </View>
          )
        })}
      </View>
    </View>
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
