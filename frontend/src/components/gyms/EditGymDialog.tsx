import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography
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
    const [form, setForm] = useState<{
        name: string;
        city: string;
        address: string;
        description: string;
        photo: string | File;
    }>({
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

    const handleChange = (field: string, value: string | File) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("city", form.city);
            formData.append("address", form.address);
            formData.append("description", form.description);
            if (form.photo instanceof File) {
                formData.append("photo", form.photo);
            }

            const res = await api.put(`/api/gyms/${gym.id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            onUpdate(res.data);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this gym? This action is irreversible.")) {
            try {
                await api.delete(`/api/gyms/${gym.id}/`);
                onDelete();
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Gym</DialogTitle>
            <DialogContent sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

                    {typeof form.photo === "string" && (
                        <Box sx={{ mt: 2 }}>
                            <Typography fontWeight="bold" variant="subtitle1" mb={1}>
                                Current Photo:
                            </Typography>
                            <img
                                src={form.photo}
                                alt="gym preview"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: 200,
                                    objectFit: "contain",
                                    borderRadius: 8,
                                }}
                            />
                        </Box>
                    )}

                    <Button variant="outlined" component="label">
                        Upload New Photo
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleChange("photo", e.target.files[0]);
                                }
                            }}
                        />
                    </Button>
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
