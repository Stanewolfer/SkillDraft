import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import CustomStackScreen from '../components/CustomStackScreen';
import { COLORS } from './styles/colors';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CustomInput({
  placeholder,
  required = false,
  multiline = false,
  numberOfLines = 1,
  value = '',
  onChangeText = () => {}
}: {
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.main_blue}
        multiline={multiline}
        numberOfLines={numberOfLines}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const CreateConversation = () => {
  const [username, setUsername] = useState('');
  const [userFound, setUserFound] = useState<any>(null);

  const fetchUserByUsername = async (username: string) => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    const encodedUsername = username.trim().replace(/ /g, '%20');

    if (!baseUrl) {
      alert('Configuration API manquante.');
      return;
    }

    if (!encodedUsername) {
      alert("Veuillez entrer un nom d'utilisateur.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/users/get-user-by-name/${encodedUsername}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Utilisateur non trouvé');
      }

      if (result?.id) {
        setUserFound(result);
        alert(`Utilisateur trouvé : ${result.username}`);
      } else {
        setUserFound(null);
        alert('Aucun utilisateur trouvé.');
      }
    } catch (error) {
      alert('Erreur lors de la recherche. Veuillez réessayer.');
      setUserFound(null);
    }
  };

  const startOrGetConversation = async () => {
    try {
      const user1Id = await AsyncStorage.getItem('userId');
      const user2Id = userFound?.id;

      if (!user1Id || !user2Id) {
        alert("Impossible d'identifier les utilisateurs.");
        return;
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/convs/start-or-get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user1Id, user2Id })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erreur création/récupération conversation :', data);
        alert(data.message || 'Erreur lors de la création de la conversation.');
        return;
      }

      router.push({
        pathname: '/messaging',
        params: {
          conversationId: data.id,
          otherUsername: userFound.username
        }
      });
    } catch (error) {
      console.error('Erreur réseau conversation :', error);
      alert('Erreur réseau. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomStackScreen title="create_conversation" />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <CustomInput
            placeholder="Rechercher un utilisateur"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <TouchableOpacity onPress={() => fetchUserByUsername(username)} style={{ marginLeft: 10 }}>
          <Text style={{ color: COLORS.main_blue, fontWeight: 'bold' }}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {userFound && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: COLORS.main_blue, fontWeight: 'bold' }}>
            Utilisateur trouvé :
          </Text>
          <Text style={{ color: COLORS.main_blue }}>Nom : {userFound.username}</Text>
          <Text style={{ color: COLORS.main_blue }}>Email : {userFound.email}</Text>
          <Text style={{ color: COLORS.main_blue }}>ID : {userFound.id}</Text>

          <TouchableOpacity
            onPress={startOrGetConversation}
            style={{
              marginTop: 15,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: COLORS.main_blue,
              borderRadius: 8
            }}
          >
            <Text style={{ color: COLORS.background_blue, fontWeight: 'bold' }}>Envoyer un message</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.background_blue
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.main_blue
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  input: {
    flex: 1,
    color: COLORS.main_blue
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    color: COLORS.main_blue
  }
});

export default CreateConversation;