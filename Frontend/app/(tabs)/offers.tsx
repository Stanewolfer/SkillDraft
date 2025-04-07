import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import COLORS from './styles/colors'

const Messaging = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offers</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.text_white
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default Messaging
