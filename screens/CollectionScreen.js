import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native'

import * as SQLite from 'expo-sqlite'

export default function CollectionScreen({ navigation }) {

    const db = SQLite.openDatabaseAsync('OwnDB')

    const [collections, setCollections] = useState([])
    //const [collectionID, setCollectionID] = useState('')
    const [collectionName, setCollectionName] = useState('')
    const [collectionImageUri, setCollectionImageUri] = useState('')

    const [refresh, setRefresh] = useState(false)

    const getCollections = async () => {
        const db = await SQLite.openDatabaseAsync('OwnDB')
        const allCollections = await db.getAllAsync(`SELECT * FROM collections`)
        setCollections(allCollections)
    }
    const insertCollection = async () => {
        if(!collectionName) return;
        const db = await SQLite.openDatabaseAsync('OwnDB');
        const result = await db.runAsync(`INSERT INTO collections (name, coverImage) VALUES (?, ?)`, collectionName, collectionImageUri)
        setRefresh(!refresh)
    }

    useEffect(() => {
        getCollections()
      }, [refresh])

    return (
        <View>
            <TextInput
                placeholder="Nombre de la Colección"
                value={collectionName}
                onChangeText={setCollectionName}/>
            <TextInput
                placeholder='Image Uri'
                value={collectionImageUri}
                onChangeText={(setCollectionImageUri)}/>
            
            <TouchableOpacity onPress={insertCollection}>
                <Text>Añadir Colección</Text>
            </TouchableOpacity>

            <FlatList
                data={collections}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Collection Name', { collectionId: item.id, collectionName: item.name })}
                    >
                        <View>
                            <Text>Nombre: {item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}