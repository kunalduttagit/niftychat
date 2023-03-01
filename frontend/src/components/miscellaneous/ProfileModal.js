import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    d={{ base: "flex" }}
                    icon={
                        <img
                            width="31px"
                            src="https://cdn-icons-png.flaticon.com/512/471/471713.png"
                        ></img>
                    }
                    onClick={onOpen}
                />
            )}

            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                <ModalOverlay />
                <ModalContent h="400px" bg="#252525" color="white">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Montserrat"
                        fontWeight="500"
                        textAlign="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between" >
              <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name}/>
              <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Montserrat" >Email: {user.email} </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
