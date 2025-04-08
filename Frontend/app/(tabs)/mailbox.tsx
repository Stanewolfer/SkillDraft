import React from 'react';
import CustomStackScreen from '../components/CustomStackScreen';
import { mailboxStyles } from '@/app/(tabs)/styles/mailboxStyles';
import { View } from 'react-native';
import PlayerConversation from '../components/PlayerConversation';

export default function Mailbox() {
  return (
    <>
      <CustomStackScreen title="Mailbox" />
      <View style={mailboxStyles.container}>
        <PlayerConversation />
      </View>
    </>
  );
}