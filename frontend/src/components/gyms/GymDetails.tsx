import {Box, Typography} from "@mui/material";
import GymDetailsCard from "./GymDetailsCard";


export default function GymDetails() {
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
                Gym Details
            </Typography>

            <GymDetailsCard>

            </GymDetailsCard>

        </Box>
    )
}