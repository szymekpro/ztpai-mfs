import {Box, Button} from "@mui/material";
import TrainingHistory from "../components/workouts/TrainingHistory.tsx";
import {useNavigate} from "react-router-dom";

export default function WorkoutsPage() {
    const navigate = useNavigate();

    return (
             <Box sx={{
                 display: 'flex',
                 flexWrap: 'wrap',
                 alignItems: 'center',
                 gap: 6,
                 flexDirection: 'row',
                 padding: 6,
            }}>
                <TrainingHistory />
                 <Button
                     variant="contained"
                     color="info"
                     onClick={ () => navigate('/schedule-workout')}
                     sx={{
                         alignSelf: 'flex-start',
                         height: 60,
                         width: 280,
                         backgroundColor: '#1976d2',
                         color: '#fff',
                         '&:hover': {
                             backgroundColor: '#115293',
                         },
                 }}>
                     Schedule a new workout
                 </Button>
            </Box>
    );
}