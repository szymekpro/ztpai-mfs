import GymsListCard from "../components/gyms/GymsListCard.tsx";
import api from "../api/axiosApi";
import {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";

interface Gym {
    id: number;
    name: string;
    city: string;
    address: string;
    description: string;
    photo_path: string;
}

export default function GymsPage() {

    const [gyms, setGyms] = useState<Gym[]>([]);

    useEffect(() => {
        api.get("api/gyms/")
            .then(res => setGyms(res.data))
            .catch(err => console.error(err));
    }, []);


    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Available Gyms:</Typography>
            <GymsListCard gyms={gyms} />
        </Box>
    );
}
