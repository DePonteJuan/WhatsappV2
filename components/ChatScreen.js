import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import MoreVertIcon from "@material-ui/icons/MoreVert"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message"
import { useState } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react"
import { useRef } from "react";
import Hidden from '@material-ui/core/Hidden';
function ChatScreen({chat,messages,openSidebar}) {
  const [user] =useAuthState(auth);
  const [input,setInput] = useState("");
  const router = useRouter();
  const [recipientSnapshot] = useCollection(db.collection("users").where("email","==",getRecipientEmail(chat.users,user)))
  const [messagesSnapshot] = useCollection(db
    .collection('chats')
    .doc(router.query.id)
    .collection('messages')
    .orderBy("timestamp","asc"))
  const showMessages = () => {
      if (messagesSnapshot){
        return messagesSnapshot.docs.map(message => (
          <Message 
          key={message.id} 
          user={message.data().user}
          message={{...message.data(), timestamp: message.data().timestamp?.toDate().getTime()}} />
        ))
      }
     
  }
  const endOfMessagesRef = useRef(null)
  const ScrollToBottom = () =>{
    endOfMessagesRef.current.scrollIntoView({
      behavior:"smooth",
      block:"start"
    })
  }
  const sendMessage = (e) =>{
    e.preventDefault();

    //Update last seen
    db.collection("users").doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()},
      {merge:true})

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })
    setInput('')
    ScrollToBottom()
  }
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  return (
    <Container>
      <Header>
        {recipient ? 
        (<div>

          <Hidden mdUp implementation="css">
          <IconButton onClick={() => openSidebar(true)}>
            <Avatar src={recipient?.photoURL}/>
          </IconButton>
          </Hidden>
          
          <Hidden smDown implementation="css">
          <IconButton >
            <Avatar src={recipient?.photoURL}/>
          </IconButton>
          </Hidden>
          
        </div>
        ):(<div>
          <Hidden mdUp implementation="css">
          <IconButton onClick={() => openSidebar(true)}>
            <Avatar >{recipientEmail[0]}</Avatar >
          </IconButton>
          </Hidden>

          <Hidden smDown implementation="css">
          <IconButton>
          <Avatar >{recipientEmail[0]}</Avatar >
          </IconButton>
          </Hidden>
        </div>
        )
      }

      <HeaderInformation>
        <h3>{recipientEmail}</h3>
        {recipientSnapshot ? (
          <p>Last active: {' '}
          {recipient?.lastSeen?.toDate() ?(
            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
          ):("Unavaible")
          }
          </p>
        ):(
          <p>Loading Last active...</p>
        )}
        
      </HeaderInformation>
      <HeaderIcons>
        <IconButton >
          <AttachFileIcon />
        </IconButton>
        <IconButton >
        <MoreVertIcon />
      </IconButton >
      </HeaderIcons>
      </Header>

    <MessageContainer>
      {showMessages()}
      <EndOfMessage ref={endOfMessagesRef} />
    </MessageContainer>

    <InputContainer>
      <InsertEmoticonIcon/>
      <Input value={input} onChange={(e) => setInput(e.target.value)}/>
      <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
      <MicIcon/>
    </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
`
const Header = styled.div`
  position:sticky;
  background-color:white;
  z-index: 100;
  top: 0;
  display:flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`
const HeaderInformation = styled.div`
  margin-left: 0.9rem;
  flex: 1;

  > h3 {
    font-size:1.5rem;
    margin-bottom:1px;
    @media(max-width: 500px){
      font-size: 1rem;
    }
    @media(max-width: 300px){
      font-size: 0.8rem;
    }

  }

  > p {
    font-size:0.8rem;
    color:gray;
    @media(max-width: 300px){
      font-size: 0.5rem;
    }
  }
`
const HeaderIcons = styled.div`
    
`
const MessageContainer = styled.div`
padding:30px;
background-color:#e5ded8;
min-height:90vh;
`
const EndOfMessage = styled.div`
margin-bottom:50px;
`
const Input = styled.input`
flex:1;
outline:0;
border:none;
border-radius:10px;
align-items:center;
padding:20px;
position:sticky;
background-color:whitesmoke;
z-index:100;
margin-left:15px;
margin-right:15px;
`
const InputContainer = styled.form`
display:flex;
align-items:center;
padding:10px;
position:sticky;
bottom:0;
background-color:white;
z-index:100;
`
