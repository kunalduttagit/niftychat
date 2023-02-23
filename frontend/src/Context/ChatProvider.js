import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const ChatContext = createContext();

//children is whole app
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        setUser(userInfo);

        //if user not logged in, return to '/' route
        if (!userInfo) {
            Navigate('/');
        }
    }, [Navigate])
    

    return (
        <ChatContext.Provider value={{ user, setUser }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext); //ChatContext is whole state
};

export default ChatProvider;
