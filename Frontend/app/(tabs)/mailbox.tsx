import React from 'react';
import CustomStackScreen from '../components/CustomStackScreen';
import { mailboxStyles } from '@/app/(tabs)/styles/mailboxStyles';
import { View } from 'react-native';
import PlayerConversation from '../components/PlayerConversation';
import { BottomNavbar } from '../components/BottomNavbar';

export default function Mailbox() {
  return (
    <>
      <CustomStackScreen title="Mailbox" />
      <View style={mailboxStyles.container}>
        <PlayerConversation pseudonym={''} lastMessage={''} date={''} profilePicture={undefined} />
      </View>
      <BottomNavbar activeScreen="messaging" logout={() => {}} />
    </>
  );
}