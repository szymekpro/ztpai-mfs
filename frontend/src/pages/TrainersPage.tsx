import {Box, Typography} from "@mui/material";
import TrainersList from "../components/trainers/TrainerList.tsx"

export default function TrainersPage() {

    const selectedGym = localStorage.getItem("selectedGymObj");
    const selectedGymObj = selectedGym ? JSON.parse(selectedGym) : null;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h6" sx={{ mb: 1 }}>
                Our Trainers on gym {selectedGymObj?.name}:
            </Typography>
            <TrainersList />
        </Box>
    );
}
