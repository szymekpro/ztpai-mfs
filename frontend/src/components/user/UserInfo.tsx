import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Divider, Avatar, Chip, CircularProgress, Button } from "@mui/material";
import api from "../../api/axiosApi.ts";
import {User} from "./UserProps.ts";
import UserEditDialog from "./UserEditDialog.tsx";
import { useNavigate } from "react-router-dom";


export default function UserInfo() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/users/me/")
            .then(res => setUser(res.data))
            .catch(err => console.error("User fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Typography color="error">Could not load user info.</Typography>
            </Box>
        );
    }

    const isAdmin = user.role === "admin";

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 600,
                mx: "auto",
                mt: 5,
                mb: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
            }}
        >
            <Card sx={{
                maxWidth: 400,
                minWidth: 200,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                boxShadow: 2,
                borderRadius: 4,
            }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: "#1565c0", fontSize: 28 }}>
                    {user.first_name?.[0] ?? ""}
                    {user.last_name?.[0] ?? ""}
                </Avatar>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        {user.first_name} {user.last_name}
                    </Typography>
                </Box>
            </Card>

            <Chip
                label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                color={
                    user.role === "admin"
                        ? "error"
                        : user.role === "employee"
                            ? "warning"
                            : "success"
                }
                sx={{ width: 128, height: 48, boxShadow: 2, fontSize: 16, fontWeight: "bold" }}
            />

            <Card sx={{ width: "100%", p: 2, boxShadow: 2, borderRadius: 4, }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Contact
                    </Typography>
                    <Divider sx={{ mt: 3, mb: 3 }} />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        <strong>Email:</strong> {user.email}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Phone:</strong> {user.phone || <span style={{ color: "#aaa" }}>—</span>}
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ width: "100%", p: 2, boxShadow: 2, borderRadius: 4, }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Address
                    </Typography>
                    <Divider sx={{ mt: 3, mb: 3 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        {user.street} {user.street_number}
                    </Typography>
                    <Typography variant="body1">
                        {user.postal_code} {user.city}
                    </Typography>
                </CardContent>
            </Card>

            {isAdmin && (
                <Button
                    variant="outlined"
                    onClick={() => setEditOpen(true)}
                    sx={{width: 200, height: 50}}
                >
                    Edit / Delete
                </Button>
            )}
            <UserEditDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                user={user}
                onSaved={updated => setUser(updated)}
                onDeleted={() => {
                    navigate("/login");
                }}
            />
        </Box>
    );
}
