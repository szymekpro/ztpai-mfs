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
    gym?: Gym;
    onUpdate: (updated: Gym) => void;
    onDelete?: () => void;
    mode: "create" | "edit";
}

export default function EditGymDialog({
                                          open,
                                          onClose,
                                          gym,
                                          onUpdate,
                                          onDelete,
                                          mode,
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

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    useEffect(() => {
        if (mode === "edit" && gym) {
            setForm({
                name: gym.name,
                city: gym.city,
                address: gym.address,
                description: gym.description,
                photo: gym.photo,
            });
        } else {
            setForm({
                name: "",
                city: "",
                address: "",
                description: "",
                photo: "",
            });
        }
    }, [gym, mode]);

    useEffect(() => {
        if (!open) {
            setForm({
                name: "",
                city: "",
                address: "",
                description: "",
                photo: "",
            });
            setErrors({});
        }
    }, [open]);

    const handleChange = (field: string, value: string | File) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("city", form.city);
            formData.append("address", form.address);
            formData.append("description", form.description);
            if (form.photo instanceof File) {
                formData.append("photo", form.photo);
            }

            const res =
                mode === "edit" && gym
                    ? await api.put(`/api/gyms/${gym.id}/`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                    : await api.post(`/api/gyms/`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });

            onUpdate(res.data);
            onClose();
        } catch (err: any) {
            if (err.response?.data) {
                const rawErrors = err.response.data;
                const flatErrors: Record<string, string> = {};

                for (const key in rawErrors) {
                    if (typeof rawErrors[key] === "object") {
                        for (const subKey in rawErrors[key]) {
                            flatErrors[`${key}.${subKey}`] = rawErrors[key][subKey];
                        }
                    } else {
                        flatErrors[key] = rawErrors[key];
                    }
                }

                setErrors(flatErrors);
            }
        }
    };

    const handleDeleteConfirmed = async () => {
        if (mode === "edit" && gym) {
            try {
                await api.delete(`/api/gyms/${gym.id}/`);
                onDelete?.();
                onClose();
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>{mode === "edit" ? "Edit Gym" : "Add New Gym"}</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Name"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            fullWidth
                            error={!!errors["name"]}
                            helperText={errors["name"]}
                        />

                        <TextField
                            label="City"
                            value={form.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            fullWidth
                            error={!!errors["city"]}
                            helperText={errors["city"]}
                        />

                        <TextField
                            label="Address"
                            value={form.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            fullWidth
                            error={!!errors["address"] || !!errors["address.address"]}
                            helperText={errors["address"] || errors["address.address"]}
                        />

                        <TextField
                            label="Description"
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors["description"]}
                            helperText={errors["description"]}
                        />

                        {mode === "edit" && typeof form.photo === "string" ? (
                            <Box sx={{ mt: 2 }}>
                                <Typography fontWeight="bold" variant="subtitle1" mb={1}>
                                    Current Photo:
                                </Typography>
                                <img
                                    src={form.photo}
                                    alt="preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: 200,
                                        objectFit: "contain",
                                        borderRadius: 8,
                                    }}
                                />
                            </Box>
                        ) : mode === "create" && form.photo instanceof File ? (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected file: {form.photo.name}
                            </Typography>
                        ) : null}

                        <Button variant="outlined" component="label">
                            Upload {mode === "edit" ? "New" : ""} Photo
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
                    {mode === "edit" && onDelete && (
                        <Button onClick={() => setConfirmDeleteOpen(true)} color="error">
                            Delete Gym
                        </Button>
                    )}
                    <Box>
                        <Button onClick={onClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {mode === "edit" ? "Save" : "Create"}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this gym? This action is irreversible.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
