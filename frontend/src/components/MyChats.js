import { Box, Button, Stack, StackDivider, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getSender } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ChatLoading from './miscellaneous/ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain, setFetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            const chatServer = await axios.get('/api/chat', config);

            if (chats && !chats.find(c => c._id === chatServer.data._id)) setChats([chatServer.data, ...chats]);

            setChats(chatServer.data);
        } catch (error) {
            toast({
                title: 'Error',
                status: 'error',
                description: `Failed to load chats : ${error.message}`,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir='column'
            alignItems='center'
            p={1}
            bg='black'
            color='white'
            w={{ base: '100%', md: '31%' }}
            borderRadius='xl'
            boxShadow='rgba(0, 0, 0, 0.2) 0px 8px 24px'
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '24px', md: '26px' }}
                fontFamily='Montserrat'
                display='flex'
                w='100%'
                justifyContent='space-between'
                alignItems='center'
                fontWeight='extrabold'
            >
                Messages
                <GroupChatModal>
                    <Button
                        display='flex'
                        bg='#252330'
                        colorScheme='purple'
                        fontSize={{ base: '17', md: 'auto', lg: '17px' }}
                        rightIcon={<img width='28px' src='https://cdn-icons-png.flaticon.com/512/4210/4210903.png' />}
                    >
                        Group
                    </Button>
                </GroupChatModal>
            </Box>

            <Box d='flex' flexDir='column' p={0} bg='#252330' w='100%' h='100%' borderRadius='lg' overflow='hidden'>
                {chats ? (
                    <Stack
                        overflowY={'scroll'}
                        borderRadius='lg'
                        height='100%'
                        scrollbarWidth='none'
                        className='stackChats'
                        p={0}
                        spacing='0'
                        divider={<StackDivider borderColor='blue.600' />}
                    >
                        {chats.map(chat => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor='pointer'
                                bg={
                                    selectedChat === chat
                                        ? 'linear-gradient(310deg, #477EF5,#2C54F3)'
                                        : 'linear-gradient(120deg, #302D3E,#333143)'
                                }
                                color={selectedChat === chat ? 'white' : 'gray.300'}
                                px={3}
                                py={5}
                                borderRadius='0'
                                key={chat._id}
                            >
                                <Text>{!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default MyChats;
