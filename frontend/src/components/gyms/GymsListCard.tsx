import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Gym {
    id: number;
    name: string;
    city: string;
    address: string;
    description: string;
    photo_path: string;
}

interface Props {
    gyms: Gym[];
}

export default function GymListCard({ gyms }: Props) {
    const navigate = useNavigate();

    const groupedGyms = gyms.reduce<Record<string, Gym[]>>((acc, gym) => {
        if (!acc[gym.city]) acc[gym.city] = [];
        acc[gym.city].push(gym);
        return acc;
    }, {});

    return (
        <Box
            sx={{
                mt: 4,
                ml: 8,
                mr: 8,
            }}
        >
            {Object.entries(groupedGyms).map(([city, gymsInCity]) => (
                <Box key={city} sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        {city}
                    </Typography>

                    {gymsInCity.map((gym) => (
                        <Paper
                            key={gym.id}
                            onClick={() => {
                                localStorage.setItem("selectedGymId", gym.id.toString());
                                localStorage.setItem("selectedGymName", gym.name);
                                navigate(`/gyms/${gym.id}`);
                            }}

                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: '#ffffff',
                                mb: 1,
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: 4,
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold" fontSize={20}>
                                    {gym.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontSize={16}>
                                    {gym.address}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            ))}
        </Box>
    );
}
