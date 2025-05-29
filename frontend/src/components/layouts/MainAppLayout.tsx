import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItemButton,
    Typography
} from '@mui/material';
import Sidebar from '../navigation/Sidebar.tsx';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from "../../api/axiosApi.ts";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


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
                    "&::-webkit-scrollbar": {
                        width: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#ccc",
                        borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#aaa",
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 4,
                        py: 2,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        zIndex: 1200,
                        position: 'sticky',
                        top: 0,
                        height: 64,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                            src="../../../public/logo-zoom.png"
                            alt="Logo"
                            style={{
                                width: 128,
                                height: 128,
                                objectFit: 'contain'
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => setDialogOpen(true)}
                            sx={{
                                height: 48,
                                minWidth: 128,
                                maxWidth: 164,
                                backgroundColor: '#619fd2',
                                color: '#fff',
                                margin: 2,
                                fontSize: 16,
                                '&:hover': {
                                    backgroundColor: '#0b4883',
                                },
                            }}
                        >
                            {selectedGym ? `${selectedGym.name}` : 'Select a gym'}
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            variant="text"
                            onClick={() => window.location.href = "/user"}
                            sx={{
                                color: '#619fd2',
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                borderRadius: 5,
                            }}
                        >
                            <AccountCircleIcon sx={{ fontSize: 36 }} />
                            <Typography sx={{ fontSize: 20 }}>
                                User</Typography>
                        </Button>
                    </Box>

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

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#fff', fontWeight: 'bold' }}>
                    Select a gym
                </DialogTitle>
                <DialogContent
                    sx={{
                        backgroundColor: '#fff',
                        boxShadow: 4,
                        borderRadius: 2,
                        p: 2,
                    }}
                >
                    <List>
                        {gyms.map((gym) => (
                            <ListItemButton
                                key={gym.id}
                                onClick={() => handleGymSelect(gym)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    backgroundColor: '#f0f4f8',
                                    '&:hover': {
                                        backgroundColor: '#dbeafe',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#c7d2fe',
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: '#1e293b',
                                    }}
                                >
                                    {gym.name}
                                </Typography>
                            </ListItemButton>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
