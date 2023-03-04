import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [showP, setShowP] = useState(false);
    const [showCp, setShowCp] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toast = useToast();

    //eye icon show/hide
    const handleClickP = () => setShowP(!showP);
    const handleClickCp = () => setShowCp(!showCp);

    //Upload image using cloudinary
    const postDetails = pic => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (
            pic.type === "image/jpeg" ||
            pic.type === "image/png" ||
            pic.type === "image/heic"
        ) {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "niftychat"); //unsigned uploading enabled
            data.append("cloud_name", "kunaldutta");
            fetch("https://api.cloudinary.com/v1_1/kunaldutta/image/upload/", {
                method: "post",
                body: data,
            })
                .then(res => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
        else {
            toast({
                title: 'Please select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false);
            return;
        }
    };

    const submitHandler = async () => {
        setLoading(true);
        //check all fields
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please fill mandatory details to sign up',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false);
            return;
        }
        //password match
        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'content-type': "application/json"
                },
            };

            const data  = await axios.post('api/user', { name, email, password, pic }, config);

            toast({
                title: 'Signed up successfully, Login to continue',
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate("/");
            window.location.reload(true);
        } catch (error) {
            toast({
                title: 'SignUp failed',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'botton',
            })
            setLoading(false);
        }
    };

    return (
        <div>
            <VStack spacing="5px">
                {/* Name */}
                <FormControl id="first-name" isRequired="true">
                    <FormLabel>Name</FormLabel>
                    <Input
                        placeholder="Enter your name"
                        onChange={e => setName(e.currentTarget.value)}
                    />
                </FormControl>

                {/* Email */}
                <FormControl id="email" isRequired="true">
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder="Enter your email"
                        onChange={e => setEmail(e.currentTarget.value)}
                    />
                </FormControl>

                {/* Password */}
                <FormControl id="password" isRequired="true">
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showP ? "text" : "password"}
                            placeholder="Choose your password"
                            paddingRight="60px"
                            onChange={e => setPassword(e.currentTarget.value)}
                        />
                        <InputRightElement w="3.5rem">
                            <Button
                                size="sm"
                                onClick={handleClickP}
                                bg="white"
                                colorScheme={"white"}
                                marginRight="5px"
                            >
                                {!showP ? (
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

                {/* Confirm Password */}
                <FormControl id="password" isRequired="true">
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showCp ? "text" : "password"}
                            placeholder="Confirm your password"
                            paddingRight="60px"
                            onChange={e =>
                                setConfirmPassword(e.currentTarget.value)
                            }
                        />
                        <InputRightElement w="3.5rem">
                            <Button
                                size="sm"
                                onClick={handleClickCp}
                                bg="white"
                                colorScheme={"white"}
                                marginRight="5px"
                            >
                                {!showCp ? (
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

                {/* Picture Upload */}
                <FormControl id="pic">
                    <FormLabel>Upload a picture</FormLabel>
                    <Input
                        type="file"
                        p={1.5}
                        accept="image/*"
                        onChange={e => postDetails(e.currentTarget.files[0])} //if multiple images, chose the first one
                    />
                </FormControl>

                {/* Submit Button */}
                <Button
                    colorScheme="twitter"
                    w="100%"
                    style={{ marginTop: 20 }}
                    onClick={submitHandler}
                    isLoading={loading}
                    loadingText="Loading"
                >
                    Sign Up
                </Button>
            </VStack>
        </div>
    );
};

export default SignUp;