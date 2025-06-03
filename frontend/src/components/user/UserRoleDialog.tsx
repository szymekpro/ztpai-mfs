import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, MenuItem, Select, FormControl, InputLabel, Box
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi";
import { User } from "./UserProps";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ManageRolesDialog({ open, onClose }: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            api.get("/api/users/")
                .then(res => setUsers(res.data))
                .catch(err => console.error("Error fetching users:", err));
        }
    }, [open]);

    const handleRoleChange = (id: number, newRole: string) => {
        setUsers(prev =>
            prev.map(u => (u.id === id ? { ...u, role: newRole } : u))
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await Promise.all(
                users.map(user =>
                    api.patch(`/api/users/${user.id}/`, { role: user.role })
                )
            );
            onClose();
        } catch (err) {
            alert("Error saving roles.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogContent>
                <Box marginTop={1}>
                {users.map(user => (
                    <Box key={user.id} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography sx={{ flex: 1 }}>{user.email}</Typography>
                        <FormControl sx={{ minWidth: 140 }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={user.role}
                                label="Role"
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            >
                                <MenuItem value="member">member</MenuItem>
                                <MenuItem value="employee">employee</MenuItem>
                                <MenuItem value="admin">admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving}>
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
}
