import {Typography, Box, Button} from "@mui/material";
import MembershipDetailsCard from "./MembershipDetailsCard.tsx";
export default function MembershipDetails() {

    return (
        <Box sx={{
            width: '100%',
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