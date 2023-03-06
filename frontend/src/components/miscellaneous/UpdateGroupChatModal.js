import {
    Box,
    Button,
    FormControl,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    const handleRemove = async anyuser => {
        if (selectedChat.groupAdmin._id !== user.data._id && anyuser._id !== user.data._id) {
            toast({
                title: 'Only Group Admins can remove someone',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: anyuser._id,
                },
                config
            );
            anyuser._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
            if (anyuser._id === user.data._id) {
                onClose();
                setSelectedChat('');
            }
        } catch (error) {
            toast({
                title: 'Sorry! ',
                status: 'error',
                discription: error.response.data.message,
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    const handleAddUser = async anyuser => {
        console.log(anyuser.name, user.data.name, selectedChat.groupAdmin.name);
        if (selectedChat.users.find(u => u._id === anyuser._id)) {
            toast({
                title: `Account already exists in ${selectedChat.chatName} `,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user.data._id) {
            toast({
                title: 'Only Admins can add Someone',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: anyuser._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Sorry! ',
                status: 'error',
                discription: error.response.data.message,
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
        setGroupChatName('');
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            const { data } = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: 'Sorry! ',
                status: 'error',
                discription: error.response.data.message,
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setRenameLoading(false);
        }

        setGroupChatName('');
    };

    const handleSearch = async query => {
        setSearch(query);
        if (!query) return;
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setSearchResult(data);
            console.log(data);

            setLoading(false);
        } catch (error) {
            toast({
                title: 'Search Failed! ',
                status: 'error',
                description: error.message,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
        }
    };

    return (
        <div>
            <IconButton
                display={{ base: 'flex' }}
                icon={<Image src='https://cdn-icons-png.flaticon.com/512/70/70115.png' w='19px' />}
                onClick={onOpen}
                marginRight='14px'
                borderRadius='full'
            ></IconButton>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg='#3F3B6C' color='#AACCFF'>
                    <ModalHeader fontSize={35} fontFamily='quicksand' display='flex' justifyContent='center'>
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
                            {selectedChat.users.map(user => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                            ))}
                        </Box>
                        <FormControl display='flex'>
                            <Input
                                placeholder='New Group Name'
                                mb={3}
                                value={groupChatName}
                                onChange={e => setGroupChatName(e.currentTarget.value)}
                            />
                            <Button
                                varient='solid'
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Change
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add friends to Group'
                                mb={1}
                                onChange={e => handleSearch(e.currentTarget.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size='lg' />
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map(user => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user.data)}>
                            Leave
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default UpdateGroupChatModal;
