import { Box } from "@mui/material"
import AddTrainingForm from "../components/workouts/AddTrainingForm.tsx"

export default function ScheduleWorkoutPage() {

    return (
        <Box sx={{
            width: '100%',
            height: 'auto',
            padding: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <AddTrainingForm />
        </Box>
    )
}