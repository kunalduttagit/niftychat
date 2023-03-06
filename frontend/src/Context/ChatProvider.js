import { useToast } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

//children is whole app
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState("");
    const [chats, setChats] = useState();
    const navigate = useNavigate();
    const toast = useToast();
   
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        setUser(userInfo);

        //if user not logged in, return to '/' route
        if (!userInfo) {
            toast({
                title: "You should Login to access your Chats",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            navigate("/");
        }
    }, [navigate])
    

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext); //ChatContext is whole state
};

export default ChatProvider;
