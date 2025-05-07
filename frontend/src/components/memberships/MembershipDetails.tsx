import {Typography, Box} from "@mui/material";
import MembershipDetailsCard from "./MembershipDetailsCard.tsx";
export default function MembershipDetails() {

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100vh',
            height: 'auto',
            padding: 2,
        }}>
            <Typography variant='h5'>
                Membership Details
            </Typography>

            <MembershipDetailsCard>

            </MembershipDetailsCard>

        </Box>
    )

}