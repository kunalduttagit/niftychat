import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const guestEmail = 'guest@niftychat.com';
    const guestPassword = 'welCome*0';

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please enter both email and password",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                header: {
                    "content-type": "application/json",
                },
            };

            const data = await axios.post(
                "api/user/login",
                { email, password },
                config
            )
            toast({
                title: "Logged in successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            toast({
                title: "Invalid email or password",
                description: error.response.data.message,
                status: "error",
                duration: 7000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <div>
            <VStack spacing={"5px"}>
                <FormControl id="email" isRequired="true">
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder="someone@example.com"
                        onChange={e => setEmail(e.currentTarget.value)}
                        value={email}
                    />
                </FormControl>

                {/* Password */}
                <FormControl id="password" isRequired="true">
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? "text" : "password"}
                            placeholder="Choose your password"
                            onChange={e => setPassword(e.currentTarget.value)}
                            value={password}
                            paddingRight="60px"
                        />
                        <InputRightElement w="3.5rem">
                            <Button
                                size="sm"
                                onClick={handleClick}
                                bg="white"
                                colorScheme={"white"}
                                marginRight="5px"
                            >
                                {!show ? (
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/6941/6941914.png"
                                        alt="Hide"
                                    />
                                ) : (
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/7268/7268616.png"
                                        alt="Show"
                                    />
                                )}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                {/* Login Button */}
                <Button
                    w="100%"
                    colorScheme={"purple"}
                    style={{ marginTop: 20 }}
                    onClick={submitHandler}
                    isLoading={loading}
                >
                    Login
                </Button>

                {/*Guest crendentials */}
                <Button
                    w="100%"
                    colorScheme="linkedin"
                    style={{ marginTop: 20 }}
                    variant="outline"
                    border="2px"
                    borderColor="pink.400"
                    onClick={() => {
                        setEmail(guestEmail);
                        setPassword(guestPassword);
                    }}
                >
                    Continue as guest
                </Button>
            </VStack>
        </div>
    );
};

export default Login;
