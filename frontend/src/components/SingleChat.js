import {
    Box,
    Button,
    FocusLock,
    FormControl,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Text,
    useStatStyles,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getSender, getSenderInfo } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import './styles.css';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5050'; //server or backend
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);

            socket.emit('joinChat', selectedChat._id);
        } catch (error) {
            toast({
                title: 'Oops! Failed to load messages  ',
                status: 'error',
                discription: error.response.data.message,
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user.data);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    const sendMessage = async event => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.data.token}`,
                    },
                };

                setNewMessage('');

                const { data } = await axios.post(
                    '/api/message',
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                socket.emit('new message', data);

                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: 'Oops! Something went wrong.  ',
                    status: 'error',
                    discription: error.response.data.message,
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            }
        }
    };

    const sendMessageButton = async event => {
        if (newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.data.token}`,
                    },
                };

                setNewMessage('');

                const { data } = await axios.post(
                    '/api/message',
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                socket.emit('new message', data);

                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: 'Oops! Something went wrong.  ',
                    status: 'error',
                    discription: error.response.data.message,
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            }
        }
    };

    useEffect(() => {
        socket.on('message received', newMessageReceived => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                {
                    if (!notification.includes(newMessageReceived)) {
                        setNotification([newMessageReceived, ...notification])
                        setFetchAgain(!fetchAgain)
                    }
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const typingHandler = e => {
        setNewMessage(e.currentTarget.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
               // console.log('Stop typing: ' + selectedChat._id)
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat._id ? (
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        w='100%'
                        fontFamily='Montserrat'
                        display='flex'
                        justifyContent={{ base: 'space-between' }}
                        alignItems='center'
                        color='white'
                    >
                        {!selectedChat.isGroupChat ? (
                            <>
                                <Box marginLeft='8px' display='flex' flexDir='row'>
                                    <ProfileModal user={getSenderInfo(user, selectedChat.users)} />
                                    <Text marginLeft='8px' fontSize='26px'>
                                        {' '}
                                        {getSender(user, selectedChat.users)}{' '}
                                    </Text>
                                </Box>
                            </>
                        ) : (
                            <>{selectedChat.chatName}</>
                        )}
                        <Box display='flex'>
                            {selectedChat.isGroupChat && <UpdateGroupChatModal
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />}
                            <IconButton
                                display={{ base: 'flex', md: 'none' }}
                                background='black'
                                colorScheme='blackAlpha'
                                icon={
                                    <img
                                        src='https://cdn-icons-png.flaticon.com/512/5708/5708793.png'
                                        width='32px'
                                        onClick={() => setSelectedChat('')}
                                    />
                                }
                            />
                        </Box>
                    </Text>
                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p={3}
                        bg='#252330'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading ? (
                            <Spinner
                                color='#284EF2'
                                size='xl'
                                w={20}
                                h={20}
                                alignSelf='center'
                                margin='auto'
                                thickness='1.7px'
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} isTyping={isTyping} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3} display="flex">
                                <Input
                                    varient='filled'
                                    placeholder='Type a messsage...'
                                    bg='#19181F'
                                    border='none'
                                    borderRadius={8}
                                    onChange={typingHandler}
                                    value={newMessage}
                                    color='white'
                                    id='send'
                                />

                                <Button
                                    px={3}
                                    py={1}
                                    ml={2}
                                    w='5.6%'
                                    h='86%'
                                    alignSelf='center'
                                    onClick={sendMessageButton}
                                >
                                    <img src='https://cdn-icons-png.flaticon.com/512/8885/8885650.png' width='28px' />
                                </Button>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
                    <Text fontSize='3xl' pb={3} fontFamily='QuickSand' color='white'>
                        Select a Chat to continue
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
