import {Box, Typography} from "@mui/material";
import TrainersList from "../components/trainers/TrainerList.tsx"

export default function TrainersPage() {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                padding: 4,
            }}
        >
            <Typography variant="h5" sx={{ mb: 1 }}>
                Our Trainers on all gyms:
            </Typography>
            <TrainersList />
        </Box>
    );
}
