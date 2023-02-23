import { Box, Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    return (
        <>
            <Box>
                <Tooltip
                    label="Search Users to chat"
                    hasArrow
                    placement="bottom"
                >
                    <Button variant='ghost'>Button?</Button>
                </Tooltip>
            </Box>
        </>
    );
};

export default SideDrawer;
