import { Box, Button } from "@mui/material";
import GymDetailsCard from "./GymDetailsCard";
import { useUserRole } from "../../hooks/useUserRole";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosApi";
import GymDialog from "./EditGymDialog";
import { Gym } from "./GymProps";

export default function GymDetails() {
    const { id } = useParams();
    const [gym, setGym] = useState<Gym | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"edit" | "create">("edit");
    const { isMember } = useUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        api
            .get(`/api/gyms/${id}/`)
            .then((res) => setGym(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleGymUpdated = (updated: Gym) => {
        setGym(updated);
        setDialogOpen(false);
    };

    const handleGymDeleted = () => {
        navigate("/gyms"); // lub inna strona
    };

    if (!gym) return <Box>Loading...</Box>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "90vw",
                height: "auto",
                padding: 2,
            }}
        >
            <GymDetailsCard gym={gym} />

            {!isMember && (
                <Box
                    sx={{
                        mt: 3,
                        maxWidth: "90vw",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            setDialogMode("edit");
                            setDialogOpen(true);
                        }}
                        sx={{ height: 48, width: 160 }}
                    >
                        Edit / Delete
                    </Button>

                </Box>
            )}

            <GymDialog
                open={dialogOpen}
                onClose={handleClose}
                gym={gym}
                mode={dialogMode}
                onUpdate={handleGymUpdated}
                onDelete={handleGymDeleted}
            />
        </Box>
    );
}
