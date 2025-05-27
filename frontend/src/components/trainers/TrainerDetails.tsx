import {Box, CardMedia, Chip, List, ListItem, ListItemText, Paper, Typography} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi";
import { Trainer } from "./TrainersProps.ts";
import { TrainerServices } from "../workouts/GymProps.ts";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function TrainerDetails() {
    const { id } = useParams();
    const [trainer, setTrainer] = useState<Trainer | null>(null);
    const [availableServices, setAvailableServices] = useState<TrainerServices[]>([]);
    const [bookedMap, setBookedMap] = useState<Record<string, string[]>>({});
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

    useEffect(() => {
        const fetchTrainerData = async () => {
            try {
                const trainerRes = await api.get(`/api/trainers/${id}/`);
                const servicesRes = await api.get(`/api/trainers/${id}/available-services/`);
                const bookedHoursRes = await api.get(`/api/trainers/${id}/booked-hours-range/`);

                setTrainer(trainerRes.data);
                setAvailableServices(servicesRes.data);
                setBookedMap(bookedHoursRes.data);
            } catch (error) {
                console.error("Error fetching trainer data or services:", error);
            }
        };
        fetchTrainerData();
    }, [id]);

    if (!trainer) {
        return <div>Loading...</div>;
    }

    const selectedStr = selectedDate?.format("YYYY-MM-DD") || "";
    const bookedHours = bookedMap[selectedStr] || [];

    return (
        <Box
            sx={{
                width: "100%",
                padding: 2,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 20,
            }}
        >
            <Box
                sx={{
                    flex: "1 1 300px",
                    maxWidth: 375,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            >
                <CardMedia
                    component="img"
                    image={trainer.photo}
                    alt={`${trainer.first_name} ${trainer.last_name}`}
                    sx={{ height: 250, width: "100%", borderRadius: 2, objectFit: "contain", backgroundColor: "#fafafa" }}
                />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
                    {trainer.description}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                    {trainer.first_name} {trainer.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    {trainer.bio}
                </Typography>
            </Box>
            <Box
                sx={{
                    flex: "1 1 300px",
                    maxWidth: 500,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    {trainer.first_name} specializes in:
                </Typography>
                {availableServices.map((service) => (
                    <Paper
                        key={service.id}
                        elevation={1}
                        sx={{
                            width: "100%",
                            p: 1.5,
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#f5f7fa",
                        }}
                    >
                        <Typography variant="body1" fontWeight="bold">
                            {service.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {service.description}
                        </Typography>
                    </Paper>
                ))}

                <Box sx={{ mt: 2, width: "100%" }}>
                    <Typography variant="h6" fontWeight="bold">Check if trainer has an available slot!:</Typography>
                    <DatePicker
                        label="Choose Date"
                        value={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                        disablePast
                        minDate={dayjs().startOf("day")}
                        maxDate={dayjs().add(1, "month").endOf("month")}
                        sx={{ width: "100%", margin: "24px 0 8px 0" }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Booked hours for {selectedStr}:
                        </Typography>
                        {bookedHours.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {bookedHours.map((hour) => (
                                    <Chip
                                        key={hour}
                                        label={hour}
                                        color="default"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            padding: '4px',
                                            borderRadius: '8px',
                                        }}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body1" color="text.secondary" mt={1}>
                                No hours booked on this day.
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
