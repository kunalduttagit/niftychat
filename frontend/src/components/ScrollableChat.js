import { Box, Tooltip } from '@chakra-ui/react';
import Lottie from 'react-lottie';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './miscellaneous/ProfileModal';
import animationData from '../animation/typing.json';

const ScrollableChat = ({ messages, isTyping }) => {
    const { user, selectedChat } = ChatState();
    const defaultOptions = {
        loop: true,
        autoplayout: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: 'flex' }} key={m._id}>
                        {(isSameSender(messages, m, i, user.data._id) || isLastMessage(messages, i, user.data._id)) && (
                            <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                                <div style={{ marginRight: '-8px' }}>
                                    <ProfileModal user={m.sender} size={8} />
                                </div>
                            </Tooltip>
                        )}
                        <span
                            style={{
                                backgroundImage: `${
                                    m.sender._id === user.data._id
                                        ? 'linear-gradient(120deg, #477EF5,#2C54F3)'
                                        : 'linear-gradient(120deg, #302D3E,#333143)'
                                }`,
                                borderRadius: '10px',
                                borderBottomRightRadius: `${m.sender._id === user.data._id ? 0 : 10}`,
                                borderTopLeftRadius: `${m.sender._id === user.data._id ? 10 : 0}`,
                                padding: '5px 15px',
                                maxWidth: '75%',
                                color: 'white',
                                marginLeft: isSameSenderMargin(messages, m, i, user.data._id),
                                marginTop: isSameUser(messages, m, i, user.data._id) ? 3 : 10,
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
            {isTyping ? (
                <Box width='100px' overflow='hidden' padding='0' height='40px' marginTop='10px'>
                    <Lottie
                        options={defaultOptions}
                        width='130%'
                        overflow='hidden'
                        style={{
                            marginBottom: '0',
                            marginLeft: '8px',
                        }}
                    />
                </Box>
            ) : (
                <></>
            )}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
