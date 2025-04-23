import { Box, Typography } from "@mui/material";
import TrainingsCard from "./TrainingsCard.tsx";
import {useEffect, useState} from "react";
import api from "../../api/axiosApi.ts";

interface TrainingHistoryProps {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
    description: string;
}

export default function TrainingHistory() {
    const [trainings, setTrainings] = useState<TrainingHistoryProps[]>([]);

    useEffect(() => {
        api.get('/api/trainings/')
            .then(res => {
                setTrainings(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <TrainingsCard>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Typography variant="h6" sx={{ alignSelf: 'flex-start' }}>
                    Your Training History:
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                }}>
                    {trainings.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            You have no training history.
                        </Typography>
                    ) : (
                        trainings.map((training) => (
                            <Box key={training.id} sx={{
                                padding: 2,
                                borderRadius: 2,
                                backgroundColor: '#f5f5f5',
                                marginBottom: 2,
                            }}>
                                <Typography variant="body1">
                                    {`Training on ${new Date(training.start_time).toLocaleString()}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`Status: ${training.status}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`Description: ${training.description}`}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </TrainingsCard>
    );
}
