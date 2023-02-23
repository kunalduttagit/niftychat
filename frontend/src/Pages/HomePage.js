import {
    Box,
    Container,
    Tabs,
    Text,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";

const HomePage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if (user) {
            toast({
                title: "You are already Logged in",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            navigate('/chats')  //if user logged in
        }
    }, [navigate]);
    return (
        <Container maxW="xl" centerContent>
            <Box
                d="flex" //display
                justifyContent="center"
                p={3} //padding
                bg={"white"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                as="center"
            >
                <Text fontSize="4xl" fontFamily="quicksand">
                    Nifty Chat
                </Text>
            </Box>

            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs variant="soft-rounded" colorScheme="green">
                    <TabList mb="1em">
                        <Tab w="50%">Login</Tab>
                        <Tab w="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login /> {/* Login Component */}
                        </TabPanel>
                        <TabPanel>
                            <SignUp /> {/* SignUp Component */}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage;
