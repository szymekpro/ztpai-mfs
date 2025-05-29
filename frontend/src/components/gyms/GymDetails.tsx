import { Box, Button } from "@mui/material";
import GymDetailsCard from "./GymDetailsCard";
import { useUserRole } from "../../hooks/useUserRole";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosApi";
import EditGymDialog from "./EditGymDialog";
import { Gym } from "./GymProps";

export default function GymDetails() {
    const { id } = useParams();
    const [gym, setGym] = useState<Gym | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { isMember } = useUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/gyms/${id}/`)
            .then(res => setGym(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!gym) return <Box>Loading...</Box>;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                width: '90vw',
                height: 'auto',
                padding: 2,
            }}
        >
            <GymDetailsCard gym={gym} />

            {!isMember && (
                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setEditDialogOpen(true)}
                        sx={{ height: 48, width: 160 }}
                    >
                        Edit / Delete
                    </Button>
                </Box>
            )}

            <EditGymDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                gym={gym}
                onUpdate={(updatedGym) => {
                    setGym(updatedGym);
                    setEditDialogOpen(false);
                }}
                onDelete={() => {
                    setEditDialogOpen(false);
                    navigate("/gyms");
                }}
            />
        </Box>
    );
}
