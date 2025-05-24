import { Box} from "@mui/material";
import AddTrainingForm from "../components/workouts/AddTrainingForm.tsx"
import TrainingHistory from "../components/workouts/TrainingHistory.tsx";

export default function WorkoutsPage() {
    return (
        <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: 2,
                paddingRight: 0,
            }}>
             <Box sx={{
                 display: 'flex',
                 gap: 4,
                 flexDirection: 'row',
            }}>
                <AddTrainingForm />
                <TrainingHistory />
            </Box>
        </Box>
    );
}