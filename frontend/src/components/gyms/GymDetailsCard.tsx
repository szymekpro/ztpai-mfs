import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    CardMedia,
    Paper,
    Grid,
} from "@mui/material";
import api from "../../api/axiosApi";
import { Gym } from "./GymProps";
import { Trainer } from "../trainers/TrainersProps.ts";
import { useNavigate } from "react-router-dom";

export default function GymDetailsCard() {
    const { id } = useParams();
    const [gym, setGym] = useState<Gym | null>(null);
    const [gymTrainers, setGymTrainers] = useState<Trainer[]>([]);
    const navigate = useNavigate();


    useEffect(() => {
        api
            .get(`/api/gyms/${id}/`)
            .then((res) => setGym(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    useEffect(() => {
        api
            .get(`/api/gyms/${id}/trainers/`)
            .then((res) => {
                const all = res.data;
                const shuffled = all.sort(() => 0.5 - Math.random()); // prosty shuffle
                const limited = shuffled.slice(0, 4); // max 4
                setGymTrainers(limited);
            })
            .catch((err) => console.error(err));
    }, [id]);

    if (!gym) return <Typography>Loading...</Typography>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                px: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 6,
                    width: "100%",
                    maxWidth: 1300,
                }}
            >
                <Box
                    sx={{
                        flex: "1 1 300px",
                        maxWidth: 600,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <CardMedia
                        component="img"
                        image={gym.photo}
                        alt={gym.name}
                        sx={{
                            width: "100%",
                            maxWidth: 500,
                            height: "auto",
                            objectFit: "contain",
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        flex: "1 1 300px",
                        maxWidth: 350,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        {gym.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.primary">
                        {gym.city}, {gym.address}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {gym.description}
                    </Typography>
                </Box>
            </Box>

            {gymTrainers.length > 0 && (
                <Box sx={{ width: "100%", maxWidth: '90vw' }}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 2, }}>
                        Trainers available at this gym:
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: 'space-around',
                            width: '100%',
                            maxWidth: '90vw',
                            mt: 3,
                        }}
                    >
                        {gymTrainers.map((trainer) => (
                            <Box
                                key={trainer.id}
                                sx={{
                                    width: {
                                        xs: '100%',
                                        sm: 'calc(50% - 12px)',
                                        md: 'calc(33.333% - 16px)',
                                        lg: 'calc(25% - 18px)',
                                    },
                                }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        height: 240,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1,
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            boxShadow: 6,
                                        },
                                    }}
                                    onClick={() => navigate(`/trainers/${trainer.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        image={trainer.photo}
                                        alt={`${trainer.first_name} ${trainer.last_name}`}
                                        sx={{
                                            height: 150,
                                            width: '100%',
                                            objectFit: 'contain',
                                            borderRadius: 2,
                                            mb: 1,
                                        }}
                                    />
                                    <Typography variant="h6">
                                        {trainer.first_name} {trainer.last_name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textAlign: 'center' }}
                                    >
                                        {trainer.description}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
