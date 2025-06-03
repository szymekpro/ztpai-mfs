import {
    Box,
    Paper,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi.ts";
import { useNavigate } from "react-router-dom";
import UserMembership from "./UserMembershipProp.ts";
import { useUserRole } from "../../hooks/useUserRole.ts";

interface UserOption {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export default function MiniMembershipCard() {
    const navigate = useNavigate();
    const { role } = useUserRole();
    const [memberships, setMemberships] = useState<UserMembership[]>([]);
    const [allMemberships, setAllMemberships] = useState<UserMembership[]>([]);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | "all">("all");
    const [loadingId, setLoadingId] = useState<number | null>(null);

    useEffect(() => {
        fetchMemberships();
        if (role !== "member") fetchUsers();
    }, []);

    const fetchMemberships = () => {
        api
            .get("/api/user-memberships/")
            .then((res) => {
                setMemberships(res.data);
                setAllMemberships(res.data);
            })
            .catch((err) => console.error(err));
    };

    const fetchUsers = () => {
        api
            .get("/api/users/")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Failed to fetch users", err));
    };

    const handleToggleStatus = async (id: number, current: boolean) => {
        setLoadingId(id);
        try {
            const res = await api.patch(`/api/user-memberships/${id}/`, {
                is_active: !current
            });
            setMemberships((prev) =>
                prev.map((m) => (m.id === id ? { ...m, ...res.data } : m))
            );
            setAllMemberships((prev) =>
                prev.map((m) => (m.id === id ? { ...m, ...res.data } : m))
            );
        } catch (err) {
            console.error("Failed to update membership", err);
        } finally {
            setLoadingId(null);
        }
    };

    const filteredMemberships =
        selectedUserId === "all"
            ? allMemberships
            : allMemberships.filter((m) => m.user.id === selectedUserId);

    return (
        <Box sx={{ width: "90vw", padding: 2 }}>
            {role !== "member" && (
                <FormControl size="small" sx={{ mb: 2, width: 285 }}>
                    <InputLabel>User</InputLabel>
                    <Select
                        value={selectedUserId}
                        label="User"
                        onChange={(e) =>
                            setSelectedUserId(
                                e.target.value === "all" ? "all" : Number(e.target.value)
                            )
                        }
                    >
                        <MenuItem value="all">All users</MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.first_name} {user.last_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "flex-start"
                }}
            >
                {filteredMemberships.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                        No memberships found.
                    </Typography>
                ) : (
                    filteredMemberships.map((item) => (
                        <Paper
                            key={item.id}
                            elevation={2}
                            onClick={() => navigate(`/memberships/${item.id}`)}
                            sx={{
                                width: 255,
                                padding: 2,
                                borderRadius: 2,
                                backgroundColor: "#fafafa",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: 4,
                                    cursor: "pointer"
                                }
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={600}>
                                {item.membership_type.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {item.membership_type.description}
                            </Typography>

                            <Typography
                                variant="body2"
                                color={item.is_active ? "success.main" : "error.main"}
                                sx={{ mt: 1, fontWeight: 500 }}
                            >
                                {item.is_active ? "Active" : "Inactive"}
                            </Typography>

                            {role !== "member" && item.user && (
                                <>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mt: 1, display: "block" }}
                                    >
                                        Owner: {item.user.first_name} {item.user.last_name} (
                                        {item.user.email})
                                    </Typography>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color={item.is_active ? "warning" : "success"}
                                        sx={{ mt: 1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleStatus(item.id, item.is_active);
                                        }}
                                        disabled={loadingId === item.id}
                                    >
                                        {item.is_active ? "Deactivate" : "Activate"}
                                    </Button>
                                </>
                            )}
                        </Paper>
                    ))
                )}
            </Box>
        </Box>
    );
}
