import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Gym } from "./GymProps.ts";
import { useState } from "react";
import GymDialog from "./EditGymDialog.tsx";

interface Props {
    gyms: Gym[];
    setGyms: (gyms: Gym[]) => void;
}

export default function GymListCard({ gyms, setGyms }: Props) {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);

    const groupedGyms = gyms.reduce<Record<string, Gym[]>>((acc, gym) => {
        if (!acc[gym.city]) acc[gym.city] = [];
        acc[gym.city].push(gym);
        return acc;
    }, {});

    const handleGymCreated = (newGym: Gym) => {
        setGyms([...gyms, newGym]);
        setDialogOpen(false);
        navigate(`/gyms/${newGym.id}`);
    };

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
            }}
        >
            {Object.entries(groupedGyms).map(([city, gymsInCity]) => (
                <Box
                    key={city}
                    sx={{
                        width: "100%",
                        maxWidth: 1000,
                        mb: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2, alignSelf: "flex-start" }}>
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
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 2,
                                borderRadius: 4,
                                backgroundColor: "#ffffff",
                                mb: 1,
                                ml: 3,
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
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

            <Button
                variant="outlined"
                color="primary"
                onClick={() => setDialogOpen(true)}
                sx={{ mt: 1, width: 150, height: 50 }}
            >
                Add New Gym
            </Button>

            <GymDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                mode="create"
                onUpdate={handleGymCreated}
            />
        </Box>
    );
}
