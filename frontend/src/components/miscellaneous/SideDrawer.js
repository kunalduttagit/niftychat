import {
    Avatar,
    Box,
    Button,
    Menu,
    MenuButton,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user } = ChatState();
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="#252525"
                w="100%"
                p="5px 10px"
            >
                <Tooltip
                    label="Search Users to chat"
                    hasArrow
                    placement="bottom"
                >
                    <Button
                        variant="ghost"
                        borderRadius="70px"
                        display="flex"
                        justifyContent="space-between"
                        height="50px"
                        colorScheme="twitter"
                    >
                        <Text
                            display={{ base: "none", md: "flex" }}
                            paddingRight="50px"
                        >
                            Search
                        </Text>
                        <img
                            width="25px"
                            src="https://cdn-icons-png.flaticon.com/512/9784/9784071.png"
                        />
                    </Button>
                </Tooltip>

                <Text
                    fontSize="3xl"
                    color="#FF6464"
                    fontFamily="QuickSand"
                    fontWeight="600"
                >
                    Nifty Chat
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <img
                                width="25px"
                                src="https://cdn-icons-png.flaticon.com/512/9187/9187534.png"
                                style={{ marginBottom: "-8px" }}
                            />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton
                            bg="#252525"
                            as={Button}
                            rightIcon={
                                <img
                                    width="25px"
                                    src="https://cdn-icons-png.flaticon.com/512/9053/9053262.png"
                                />
                            }
                        >
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.data.name}
                                src={user.data.pic}
                                boxSize="2.75em"
                            />
                        </MenuButton>
                    </Menu>
                </div>
            </Box>
        </>
    );
};

export default SideDrawer;
