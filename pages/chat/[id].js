import React, { useState } from 'react';
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail"
import Hidden from '@material-ui/core/Hidden';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

function Chat({chat,messages}) {
  const [open, setOpen] = useState(false);
  
  const [ user] = useAuthState(auth);
  return (
    <Container>
      <Head>
      <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Hidden mdUp implementation="css">
       <SwipeableDrawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => {}}
          >
      <Sidebar />
          </SwipeableDrawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Sidebar/>
      </Hidden>

      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} openSidebar={setOpen}/>
      </ChatContainer>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  //Prep messages on the server
  const messagesRes = await ref
  .collection('messages')
  .orderBy("timestamp", "asc")
  .get();

  const messages = messagesRes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })).map(messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime()
  }))

  //Prep chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat
    }
  }
}
const Container = styled.div`
  display:flex;
`
const ChatContainer = styled.div`
  flex:1;
  overflow: scroll;
  height:100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

