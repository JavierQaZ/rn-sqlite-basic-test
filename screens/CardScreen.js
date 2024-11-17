import React, { useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native'
import * as SQLite from 'expo-sqlite'

export default function CardScreen({ route }) {

    const db = SQLite.openDatabaseAsync('OwnDB')

    const { collectionId, collectionName } = route.params;

    const [cards, setCards] = useState([])
    const [cardID, setCardID] = useState('')
    const [cardName, setCardName] = useState('')
    const [cardImageUri, setCardImageUri] = useState('')
    const [cardState, setCardState] = useState(false)

    const [refresh, setRefresh] = useState(false)

    const getCards = async () => {
        const db = await SQLite.openDatabaseAsync('OwnDB')
        const allCards = await db.getAllAsync(`SELECT * FROM cards WHERE collectionId = ?`, collectionId)
        setCards(allCards)
    }

    const insertCard = async () => {
        const db = await SQLite.openDatabaseAsync('OwnDB');
        const result= await db.runAsync(`INSERT INTO cards (id, collectionId, name, image, state) VALUES (?, ?, ?, ?, ?)`, cardID, collectionId, cardName, cardImageUri, cardState ? 1 : 0)
        setRefresh(!refresh)
    }

    useEffect(() => {
        getCards()
    }, [refresh])

    return (
        <View>
      <Text>Colección: {collectionName}</Text>
      <TextInput
        placeholder="ID de la Carta"
        value={cardID}
        onChangeText={setCardID}
      />
      <TextInput
        placeholder="Nombre de la Carta"
        value={cardName}
        onChangeText={setCardName}
      />
      <TextInput
        placeholder="Imagen (URI)"
        value={cardImageUri}
        onChangeText={setCardImageUri}
      />
      <TextInput
        placeholder="Estado (true/false)"
        value={String(cardState)}
        onChangeText={setCardState}
      />
      <TouchableOpacity onPress={insertCard}>
        <Text>Añadir Carta</Text>
      </TouchableOpacity>

      <FlatList
        data={cards}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>ID: {item.id}</Text>
            <Text>Nombre: {item.name}</Text>
            <Text>Estado: {item.state ? 'Adquirida' : 'No adquirida'}</Text>
          </View>
        )}
      />
    </View>
    )
}