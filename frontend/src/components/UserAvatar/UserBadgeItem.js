import { Box, Button } from '@chakra-ui/react';

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius='lg'
            m={1}
            mb={2}
            variant='solid'
            fontSize={14}
            background='purple.200'
            color='gray.600'
            cursor='poiter'
            onClick={handleFunction}
            display='flex'
        >
            {user.name}
            <img src='https://cdn-icons-png.flaticon.com/512/2723/2723639.png' width='19px' />
        </Box>
    );
};

export default UserBadgeItem;