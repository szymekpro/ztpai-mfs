import {Box} from "@mui/material";
import UserInfo from "../components/user/UserInfo.tsx";

export default function UserPage() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            gap: 4,
        }}>
            <UserInfo/>
        </Box>
    )
}