import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InscriptionScreen() {
  return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Inscription</Text>
          <View style={styles.titleUnderline} />
        </View>
  
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#010017',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 150,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 20,
      color: '#FFFFFF',
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
    },
    titleUnderline: {
      marginTop: 4,
      height: 3,
      width: 150,
      backgroundColor: '#A9F6CB',
      borderRadius: 2,
    },
  });
  