import { Box, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axiosApi'; // zakładam że masz swój axios wrapper

interface Gym {
    id: number;
    name: string;
    city: string;
    address: string;
    description: string;
    photo_path: string;
}

export default function GymDetailsCard() {
    const { id } = useParams();
    const [gym, setGym] = useState<Gym | null>(null);

    useEffect(() => {
        api.get(`/api/gyms/${id}/`)
            .then(res => setGym(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!gym) return <Typography>Loading...</Typography>;

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: 800,
                minWidth: 500,
                margin: '2rem auto',
                padding: 4,
                borderRadius: 4,
                backgroundColor: '#ffffff',
            }}
        >
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',

                }}>
                    <Typography variant="h4" gutterBottom>
                        {gym.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {gym.city}, {gym.address}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {gym.description}
                    </Typography>
                </Box>

                {gym.photo_path && (
                    <Box
                        component="img"
                        src={gym.photo_path}
                        alt={gym.name}
                        sx={{
                            width: '100%',
                            maxHeight: 400,
                            objectFit: 'cover',
                            borderRadius: 2,
                            my: 2,
                        }}
                    />
                )}
            </Box>
        </Paper>
    );
}
