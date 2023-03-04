import { Box } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    return (
        <Box
            display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
            alignItems='center'
            flexDir='column'
            p={3}
            bg='black'
            w={{ base: '100%', md: '68%' }}
            borderRadius='xl'
            boxShadow='rgba(0, 0, 0, 0.2) 0px 8px 24px'
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default ChatBox;