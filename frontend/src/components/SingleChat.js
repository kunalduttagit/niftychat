import { Box, IconButton, Text } from '@chakra-ui/react';
import { getSender, getSenderInfo } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
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
                            <>
                                {selectedChat.chatName}
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                            </>
                        )}
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
                    </Text>
                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p={3}
                        bg='#252525'
                        w='100%'
                        h='100%'
                        borderRadius='2xl'
                        overflowY='hidden'
                    ></Box>
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
