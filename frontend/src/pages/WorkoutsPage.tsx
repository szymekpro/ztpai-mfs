import { Box, Typography } from "@mui/material";
import AddTrainingForm from "../components/workouts/AddTrainingForm.tsx"
import TrainingHistory from "../components/workouts/TrainingHistory.tsx";

export default function WorkoutsPage() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            width: '100vh',
            padding: 2,
        }}>
            <Typography variant="h5">Add New Scheduled Training</Typography>
            <AddTrainingForm />
            <Typography variant="h5">Your Training History</Typography>
            <TrainingHistory />
        </Box>
    );
}