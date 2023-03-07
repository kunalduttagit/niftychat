import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSender } from '../../config/ChatLogics';
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import ChatLoading from './ChatLoading';
import ProfileModal from './ProfileModal';
import { Effect } from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge'

const SideDrawer = ({ fetchAgain, setFetchAgain }) => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
        window.location.reload(true);
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Sorry',
                status: 'warning',
                description: 'To connect, please enter their name or email address',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            setSearchResult([]);
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };
            const users = await axios.get(`/api/user?search=${search}`, config);
            if (users.data.length > 0) {
                setSearchResult(users.data);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                status: 'error',
                description: 'Failed to load search results',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
        }
    };

    const accessChat = async userId => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${user.data.token}`,
                },
            };
            //const data =
            await axios.post('/api/chat', { userId }, config).then(data => proceed(data));

            function proceed(data) {
                setSelectedChat(data.data);
                setLoadingChat(false);
                setFetchAgain(!fetchAgain);
                onClose();
            }
            
        } catch (error) {
            toast({
                title: 'Error fetcing chats',
                status: 'error',
                description: error.message,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            setLoadingChat(false);
        }
    };

    return (
        <>
            <Box display='flex' justifyContent='space-between' alignItems='center' bg='#252330' w='100%' p='5px 10px'>
                <Tooltip label='Search your friends' hasArrow placement='bottom' openDelay='500'>
                    <Button
                        variant='ghost'
                        borderRadius='70px'
                        display='flex'
                        justifyContent='space-between'
                        height='50px'
                        colorScheme='twitter'
                        onClick={onOpen}
                    >
                        <Text display={{ base: 'none', md: 'flex' }} paddingRight='50px'>
                            Search
                        </Text>
                        <img width='25px' src='https://cdn-icons-png.flaticon.com/512/9784/9784071.png' />
                    </Button>
                </Tooltip>

                <Text fontSize='3xl' color='#FF6464' fontFamily='QuickSand' fontWeight='600'>
                    Nifty Chat
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                            <img
                                width='25px'
                                src='https://cdn-icons-png.flaticon.com/512/9187/9187534.png' //bell icon
                                style={{ marginBottom: '-8px' }}
                            />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && 'No new message'}
                            {notification.map(notif => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter(n => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New message in ${notif.chat.chatName}`
                                        : `New message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton
                            colorScheme='black'
                            as={Button}
                            rightIcon={
                                <img width='25px' src='https://cdn-icons-png.flaticon.com/512/9053/9053262.png' /> //down arrow
                            }
                        >
                            <Avatar
                                size='sm'
                                cursor='pointer'
                                name={user.data.name}
                                src={user.data.pic}
                                boxSize='2.75em'
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user.data}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent bg='black' color='white'>
                    <DrawerHeader borderBottomWidth='1px'>Search</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb={2} pt={4}>
                            <Input
                                placeholder='Name or Email'
                                mr={2}
                                value={search}
                                onChange={e => setSearch(e.currentTarget.value)}
                            />
                            <Button color='red' onClick={handleSearch}>
                                Go
                            </Button>
                        </Box>

                        {loading ? (
                            <ChatLoading />
                        ) : (
                            //optional chaining
                            searchResult?.map(user => (
                                <UserListItem user={user} key={user._id} handleFunction={() => accessChat(user._id)} />
                            ))
                        )}
                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;
