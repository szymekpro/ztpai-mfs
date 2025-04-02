import {Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi.ts";

interface Gym {
    id: number;
    name: string;
    city: string;
    address: string;
    photo_path: string;
}

interface Trainer {
    id: number;
    first_name: string;
    last_name: string;
    gym: Gym;
    bio: string;
    photo_path: string;
}

interface FormValues {
    trainer: string;
    gym: string;
    start_time: string;
    end_time: string;
    status: string;
    description: string;
}

export default function AddTrainingForm() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [gyms, setGyms] = useState<Gym[]>([]);

    const [formData, setFormData] = useState<FormValues>({
        trainer: '',
        gym: '',
        start_time: '',
        end_time: '',
        status: 'scheduled',
        description: ''
    });

    useEffect(() => {
        api.get('api/trainers/').then(res => setTrainers(res.data));
        api.get('api/gyms/').then(res => setGyms(res.data));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        api.post('api/trainings/', formData)
            .then(() => {
                alert("Training added!");
                setFormData({
                    trainer: '',
                    gym: '',
                    start_time: '',
                    end_time: '',
                    status: 'scheduled',
                    description: ''
                });
            })
            .catch(err => console.error(err));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 500,
            ml: 8,
        }}>
            <FormControl fullWidth required>
                <InputLabel>Trainer</InputLabel>
                <Select name="trainer" value={formData.trainer} onChange={handleChange}>
                    {trainers.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                            {t.first_name} {t.last_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth required>
                <InputLabel>Gym</InputLabel>
                <Select name="gym" value={formData.gym} onChange={handleChange}>
                    {gyms.map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                            {g.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Start Time"
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
            />

            <TextField
                label="End Time"
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
            />

            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
            />

            <Button type="submit" variant="contained" color="primary">
                Add Training
            </Button>
        </Box>
    );
}
