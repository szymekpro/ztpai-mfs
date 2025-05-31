import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { User } from "./UserProps.ts";
import api from "../../api/axiosApi.ts";

type Props = {
    open: boolean;
    onClose: () => void;
    user: User | null;
    onSaved: (updated: User) => void;
    onDeleted?: () => void;
};

export default function UserEditDialog({ open, onClose, user, onSaved, onDeleted }: Props) {
    const [form, setForm] = useState<Partial<User>>(user || {});
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const id = user?.id

    useEffect(() => {
        if (open && user) {
            setForm(user);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log(form)
            const res = await api.patch(`/api/users/${id}/`, form);
            onSaved(res.data);
            onClose();
        } catch (e) {
            alert("Could not update user.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await api.delete(`/api/users/${id}/`);
            if (onDeleted) onDeleted();
            onClose();
        } catch (e) {
            alert("Could not delete user.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit User Info</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="First Name"
                        name="first_name"
                        value={form.first_name || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        name="last_name"
                        value={form.last_name || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={form.phone || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Street"
                        name="street"
                        value={form.street || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Street Number"
                        name="street_number"
                        value={form.street_number || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Postal Code"
                        name="postal_code"
                        value={form.postal_code || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="City"
                        name="city"
                        value={form.city || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
                {confirmDelete && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: "#fdecea", borderRadius: 2 }}>
                        <Typography color="error" sx={{ mb: 1 }}>
                            Are you sure you want to delete this account? This action cannot be undone!
                        </Typography>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleDelete}
                            disabled={saving}
                            sx={{ mr: 1 }}
                        >
                            Yes, delete
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setConfirmDelete(false)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving}>Save</Button>
                {!confirmDelete && (
                    <Button
                        onClick={() => setConfirmDelete(true)}
                        color="error"
                        variant="outlined"
                        sx={{ ml: 2 }}
                        disabled={saving}
                    >
                        Delete account
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
