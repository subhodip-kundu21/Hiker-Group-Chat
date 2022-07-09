import { useEffect, useRef, useState } from "react";
import {Box,Button,Container,HStack,Input,VStack,Text} from "@chakra-ui/react";
import Message from "./Components/Message";
import { app } from "./firebase";
import {onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth";
import {getFirestore,addDoc,collection,serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logoutHandler = () => signOut(auth);

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        sendTime: new Date().getHours() + ":" + new Date().getMinutes(),
        createdAt: serverTimestamp(),
      });

      divForScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  return (
    <Box bg={"#192734"}>
      {user ? (
        <Container h={"100vh"} paddingY={"4"} bg={"#FEFBE7"}>
          <VStack h="full">
            <Button onClick={logoutHandler} colorScheme={"telegram"} w={"full"}>
              Logout
            </Button>
            <Text fontSize='6xl' color='chakra-placeholder-color'>HIKER</Text>

            <VStack
              h="full"
              w={"full"}
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              bg={"#F8F9D7"}
              >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                  time={item.sendTime}
                />
              ))}

              <div ref={divForScroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message..."
                />
                <Button colorScheme={"whatsapp"} type="submit">
                Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack bg="white" justifyContent={"center"} h="100vh">
          <Button onClick={loginHandler} colorScheme={"telegram"}>
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;