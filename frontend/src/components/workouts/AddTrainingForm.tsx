import {
    Box, Button, MenuItem, Select, InputLabel,
    FormControl, SelectChangeEvent, TextField, ToggleButton, ToggleButtonGroup, Typography, CircularProgress, IconButton
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi.ts";
import dayjs, { Dayjs } from 'dayjs';
import TrainingFormCard from "./TrainingFormCard.tsx";
import {Gym, Trainer, FormValues, TrainerServices} from "./GymProps.ts"
import { useNavigate } from "react-router-dom";

export default function AddTrainingForm() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [bookedHours, setBookedHours] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedHour, setSelectedHour] = useState<string | null>(null);
    const [availableServices, setAvailableServices] = useState<TrainerServices[]>([]);
    const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormValues>({
        trainer: '',
        gym: '',
        status: 'scheduled',
        description: '',
        service_type: ''
    });

    const availableHours = [
        "06:00", "07:00", "08:00", "09:00",
        "10:00", "11:00", "12:00", "13:00", "14:00"
    ];

    useEffect(() => {
        api.get('api/trainers/').then(res => setTrainers(res.data));
        api.get('api/gyms/').then(res => setGyms(res.data));
        api.get('api/user-memberships/active/').then(res => {
            setHasActiveMembership(res.data.has_membership);
            console.log("API returned:", res.data);
        });
    }, []);

    useEffect(() => {
        if (!formData.trainer || !selectedDate) return;

        const dateStr = selectedDate.format('YYYY-MM-DD');
        api.get(`/api/trainers/${formData.trainer}/booked-hours/?date=${dateStr}`)
            .then(res => setBookedHours(res.data.booked_hours))
            .catch(err => console.error("Failed to fetch booked hours:", err));
    }, [formData.trainer, selectedDate]);

    useEffect(() => {
        setSelectedHour(null);
        }, [selectedDate]);


    useEffect(() => {
        if (!formData.trainer) return;

        api.get(`/api/trainers/${formData.trainer}/available-services/`)
            .then(res => setAvailableServices(res.data))
            .catch(err => console.error("Failed to fetch trainer services:", err));
    }, [formData.trainer]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const storedGym = localStorage.getItem("selectedGymObj");
    const gym: Gym | null = storedGym ? JSON.parse(storedGym) : null;

    const filteredTrainers = gym
        ? trainers.filter((t) => Number(t.gym) === Number(gym.id)) : [];


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedDate || !selectedHour || !formData.service_type) {
            alert("Please select trainer, service and date with hour.");
            return;
        }

        const combinedStart = dayjs(`${selectedDate.format("YYYY-MM-DD")}T${selectedHour}`);
        const combinedEnd = combinedStart.add(1, 'hour');

        if (!gym) {
            alert("Please select an active gym.");
            return;
        }
        formData.gym = gym.id.toString();

        api.post('api/trainings/', {
            ...formData,
            trainer_id: formData.trainer,
            service_type_id: formData.service_type,
            start_time: combinedStart.toISOString(),
            end_time: combinedEnd.toISOString()
        })
            .then(() => {
                alert("Training added!");
                setFormData({
                    trainer: '',
                    gym: '',
                    status: 'scheduled',
                    description: '',
                    service_type: '',
                });
                setSelectedDate(null);
                setSelectedHour(null);
                navigate('/workouts');
            })
            .catch(err => console.error(err));
    };

    return (
        <TrainingFormCard>
            {hasActiveMembership === null ? (
                <CircularProgress />
            ) : hasActiveMembership ? (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Typography variant="h6" mt={2}>
                    Schedule new workout:
                </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            maxWidth: 500,
            minWidth: 500,
        }}>
            <FormControl required sx={{mt: 2, width: 300}}>
                <InputLabel>Trainer</InputLabel>
                <Select
                    name="trainer"
                    value={formData.trainer}
                    onChange={handleChange}>
                    {filteredTrainers.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                            {t.first_name} {t.last_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl required sx={{width: 300}}>
                <InputLabel>Trainer's Service</InputLabel>
                    <Select
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        disabled={!availableServices.length}
                    >
                        {availableServices.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                                {s.name}
                            </MenuItem>
                        ))}
                    </Select>
            </FormControl>
            <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                minDate={dayjs()}
                sx={{width: 300}}
                slotProps={{
                    textField: {
                        required: true,
                    },
                }}
            />
            {selectedDate && (
                <Box>
                    <ToggleButtonGroup
                  key={selectedDate?.format('YYYY-MM-DD') || 'no-date'}
                  value={selectedHour}
                  exclusive
                  onChange={(e, newValue) => {
                    if (newValue !== null) setSelectedHour(newValue);
                  }}
                  sx={{
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: 'center',
                    '& .MuiToggleButtonGroup-grouped': {
                      borderRadius: 2,
                      margin: '4px',
                      border: '1px solid #ccc',
                      minWidth: '60px',
                      height: '36px',
                      fontWeight: 600,
                      backgroundColor: '#ece9e9',
                      color: '#404042',
                      '&.Mui-selected': {
                        backgroundColor: '#1d7ecd',
                        color: '#fff',
                        borderColor: '#1d7ecd',
                      },
                      '&:hover': {
                        backgroundColor: '#d5e8f7',
                      },
                    },
                  }}
                >
                  {availableHours.map((hour) => (
                    <ToggleButton
                      key={hour}
                      value={hour}
                      disabled={
                        bookedHours.includes(hour) ||
                        (selectedDate?.isSame(dayjs(), 'day') &&
                         Number(hour.split(':')[0]) <= dayjs().hour())
                      }
                    >
                      {hour}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                </Box>
            )}
            <TextField
                label="Notes"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{width: 300}}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                    !formData.trainer || !formData.service_type || !selectedDate || !selectedHour
                }
                sx={{
                    mb: 2,
                    backgroundColor: '#1d7ecd',
                    height: 40,
                    width: 300,
                    '&:hover': {
                        backgroundColor: '#1d7ecd',
                    },
            }}>
                Schedule Training
            </Button>
            </Box>
        </Box>
            ) : (
                <Typography color="error">
                    You need an active membership to schedule a training.
                </Typography>)
            }
        </TrainingFormCard>
    );
}
