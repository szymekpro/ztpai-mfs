import {Gym} from "../gyms/GymProps.ts"
import {useEffect, useState} from "react";
import api from "../../api/axiosApi.ts"
import {useNavigate, useParams} from "react-router-dom";
import {Box, Paper, Typography} from "@mui/material";

export default function TrainerGym() {
    const { id } = useParams();
    const [gym, setGym] = useState<Gym | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/trainers/${id}/trainer-gym`)
            .then((res) => setGym(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!gym) {
        return <Typography>Loading gym...</Typography>;
    }

    return (
        <Box sx={{
            flex: "1 1 150px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,

        }}>
            <Typography variant="h6" fontWeight="bold">
                Trainer works on:
            </Typography>
            <Paper
                onClick={() => navigate(`/gyms/${gym.id}`)}
                elevation={1}
                sx={{
                    width: "100%",
                    p: 1.5,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f5f7fa",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                        cursor: "pointer"
                    }
                }}
            >
                <Typography variant="body1" fontWeight="bold">
                    {gym.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {gym.city}, {gym.address}
                </Typography>
            </Paper>
        </Box>
    )
}