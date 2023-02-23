import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import { ChatState } from "../Context/ChatProvider";

const ChatPage = () => {
    const { user } = ChatState();

    return <div style={{ width: '100%' }}>
        {user && <SideDrawer />}
        <Box
            display="flex"
            justifyContent='space-between'
            w='100%'
            height='91.5vh'
            p='10px'
        >
            {user && <MyChats />}
            {user && <ChatBox />}
        </Box>
    </div>;
};

export default ChatPage;
