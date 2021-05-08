import moment from "moment"
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"
function Message({user,message}) {
  const [userLoggedIn] = useAuthState(auth)
  const TypeOfMessage = user === userLoggedIn.email ? Sender: Reciever
  return (
    <Container>
      <TypeOfMessage>{message.message}
      <Timestamp>{message.timespamp ? moment(message.timespamp).format('LT') : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  )
}

export default Message

const Container = styled.div``
const MessageElement = styled.div`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width:60px;
  padding-bottom: 26px;
  position: relative;
  text-align:center;
`
const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`
const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
`
const Timestamp = styled.span`
  color:gray;
  padding:10px;
  font-size:9px;
  position:absolute;
  bottom:0;
  right:0;
  text-align:right;
`

