import {
    Box,
    Button,
    FormControl,
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

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats } = ChatState();

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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Fill all necessary details! ',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map(user => user._id)),
                },
                config
            );
            setChats([data, ...chats]);
            onClose();
            toast({
                title: 'Group successfully created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            toast({
                title: "Group can't be created! ",
                status: 'error',
                discription: error.response.data,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const handleGroup = userToAdd => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already exists! ',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = delUser => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== delUser._id));
    };

    return (
        <>
            <span onClick={onOpen}> {children} </span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg='#1B2430' color='white'>
                    <ModalHeader fontSize='35px' fontFamily='Montserrat' display='flex' justifyContent='center'>
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDirection='column' alignItems='center'>
                        <FormControl>
                            <Input
                                placeholder='Group Name'
                                mb={3}
                                onChange={e => setGroupChatName(e.currentTarget.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add users eg: John, Sheldon, Robin'
                                mb={1}
                                onChange={e => handleSearch(e.currentTarget.value)}
                            />
                        </FormControl>
                        <Box w='100%' display='flex'>
                            {selectedUsers.map(user => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                            ))}
                        </Box>

                        {loading ? (
                            <Spinner ml='auto' display='flex' />
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map(user => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='whatsapp' mr={3} onClick={handleSubmit}>
                            CREATE
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModal;
