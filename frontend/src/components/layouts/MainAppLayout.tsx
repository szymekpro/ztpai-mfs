import {Box, Button, Dialog, DialogTitle, DialogContent, List, ListItemButton, Typography} from '@mui/material';
import Sidebar from '../navigation/Sidebar.tsx';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from "../../api/axiosApi.ts";

interface Gym {
    id: number;
    name: string;
    city: string;
    address: string;
    description: string;
    photo_path: string;
}

export default function MainAppLayout() {
    const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [gyms, setGyms] = useState<Gym[]>([]);

    useEffect(() => {
            api.get('api/gyms/')
            .then(res => setGyms(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const gymFromStorage = localStorage.getItem('selectedGymObj');

        if (gymFromStorage) {
            try {
                const parsedGym: Gym = JSON.parse(gymFromStorage);
                setSelectedGym(parsedGym);
            } catch (error) {
                console.error('Invalid selectedGym in localStorage:', error);
            }
        }
    }, []);

    const handleGymSelect = (gym: Gym) => {
        setSelectedGym(gym);
        localStorage.setItem('selectedGymObj', JSON.stringify(gym));
        setDialogOpen(false);
        window.location.reload();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                overflow: 'auto',
                backgroundColor: '#ece9e9',
            }}
        >
            <Sidebar />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    height: '100vh',
                    overflowY: 'auto',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    m: 2,
                    mt: 4,
                    zIndex: 1200,
                    height: 50,
                }}>
                    <img src="../../../public/logo-zoom.png" alt="Logo" style={{
                        width: 128,
                        height: 128,
                        objectFit: 'contain'
                    }} />
                    <Button
                        variant="contained"
                        onClick={() => setDialogOpen(true)}
                        sx={{
                            ml: 2,
                            height: '80%',
                            width: 128,
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#115293',
                            },
                        }}
                    >
                        {selectedGym ? `${selectedGym.name}` : 'Select a gym'}
                    </Button>
                </Box>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 2,
                        pl: 4,
                        pr: 4,
                    }}
                >
                    <Outlet />
                </Box>
            </Box>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Select a gym</DialogTitle>
                <DialogContent>
                    <List>
                        {gyms.map((gym) => (
                            <ListItemButton
                                key={gym.id}
                                onClick={() => handleGymSelect(gym)}
                            >
                                {gym.name}
                            </ListItemButton>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
