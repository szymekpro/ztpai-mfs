import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Gym } from "./GymProps";
import api from "../../api/axiosApi";

interface Props {
    open: boolean;
    onClose: () => void;
    gym: Gym;
    onUpdate: (updated: Gym) => void;
    onDelete: () => void;
}

export default function EditGymDialog({
                                          open,
                                          onClose,
                                          gym,
                                          onUpdate,
                                          onDelete,
                                      }: Props) {
    const [form, setForm] = useState({
        name: "",
        city: "",
        address: "",
        description: "",
        photo: "",
    });

    useEffect(() => {
        if (gym) {
            setForm({
                name: gym.name,
                city: gym.city,
                address: gym.address,
                description: gym.description,
                photo: gym.photo,
            });
        }
    }, [gym]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = () => {
        api
            .put(`/api/gyms/${gym.id}/`, form)
            .then((res) => {
                onUpdate(res.data);
            })
            .catch((err) => console.error("Update failed:", err));
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this gym? This action cannot be undone.")) {
            api
                .delete(`/api/gyms/${gym.id}/`)
                .then(() => {
                    onDelete();
                })
                .catch((err) => console.error("Delete failed:", err));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Gym</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="City"
                        value={form.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Address"
                        value={form.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="Photo URL"
                        value={form.photo}
                        onChange={(e) => handleChange("photo", e.target.value)}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
                <Button onClick={handleDelete} color="error">
                    Delete Gym
                </Button>
                <Box>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
