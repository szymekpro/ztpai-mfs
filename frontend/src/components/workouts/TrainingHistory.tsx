import {
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Autocomplete,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi.ts";
import { TrainingHistoryProps } from "GymProps.ts";
import TrainingCard from "./TrainingCard.tsx";
import dayjs from "dayjs";
import { useUserRole } from "../../hooks/useUserRole.ts";

interface User {
    id: number;
    first_name: string;
    last_name: string;
}

export default function TrainingHistory() {
    const [trainings, setTrainings] = useState<TrainingHistoryProps[]>([]);
    const currentMonth = dayjs().format("YYYY-MM");
    const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [trainingToCancel, setTrainingToCancel] = useState<number | null>(null);
    const { role } = useUserRole();

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const startDate = dayjs("2025-03-01");
    const now = dayjs();

    const monthsList: string[] = [];
    let current = startDate.startOf("month");

    while (current.isBefore(now, "month") || current.isSame(now, "month")) {
        monthsList.push(current.format("YYYY-MM"));
        current = current.add(1, "month");
    }

    useEffect(() => {
        api
            .get("/api/trainings/")
            .then((res) => setTrainings(res.data))
            .catch((err) => console.error(err));

        if (role !== "member") {
            api
                .get("/api/users/?role=member")
                .then((res) => setUsers(res.data))
                .catch((err) => console.error("User fetch error:", err));
        }
    }, [role]);

    const filteredTrainings = trainings.filter((t) => {
        const matchesMonth = dayjs(t.start_time).format("YYYY-MM") === monthFilter;
        const matchesUser = selectedUser ? t.user.id === selectedUser.id : true;
        return matchesMonth && matchesUser;
    });

    const askToCancelTraining = (trainingId: number) => {
        setTrainingToCancel(trainingId);
        setConfirmOpen(true);
    };

    const confirmCancelTraining = () => {
        if (!trainingToCancel) return;

        api
            .patch(`/api/trainings/${trainingToCancel}/`, { status: "cancelled" })
            .then(() => {
                setTrainings((prev) =>
                    prev.map((t) =>
                        t.id === trainingToCancel ? { ...t, status: "cancelled" } : t
                    )
                );
            })
            .catch((err) => console.error("Failed to cancel training:", err))
            .finally(() => {
                setConfirmOpen(false);
                setTrainingToCancel(null);
            });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "95vw",
                minWidth: 330,
                height: "auto",
                overflow: "auto",
                alignItems: "center",
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ccc",
                    borderRadius: 3,
                },
                "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#aaa" },
            }}
        >
            <Box
                sx={{
                    alignSelf: "flex-start",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 3,
                    mt: 1,
                    mb: 5,
                }}
            >
                <Typography variant="h6">
                    {role === "member" ? "Your Training History:" : "Users Training History:"}
                </Typography>

                <FormControl size="small">
                    <InputLabel>Month</InputLabel>
                    <Select
                        value={monthFilter}
                        label="Month"
                        onChange={(e) => setMonthFilter(e.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        {monthsList.map((month) => (
                            <MenuItem key={month} value={month}>
                                {dayjs(month).format("MMMM YYYY")}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {role !== "member" && (
                    <Autocomplete
                        options={users}
                        value={selectedUser}
                        onChange={(_, value) => setSelectedUser(value)}
                        getOptionLabel={(user) => `${user.first_name} ${user.last_name}`}
                        renderInput={(params) => (
                            <TextField {...params} label="Filter by user" size="small" />
                        )}
                        sx={{ minWidth: 200 }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                )}
            </Box>

            {filteredTrainings.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No trainings found for this month.
                </Typography>
            ) : (
                <Box ml={2}>
                    <Grid container spacing={4}>
                        {filteredTrainings.map((training) => (
                            <Grid item xs={12} sm={6} md={4} key={training.id}>
                                <TrainingCard training={training} onCancel={askToCancelTraining} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Cancel Training?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this training session?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>No</Button>
                    <Button onClick={confirmCancelTraining} variant="contained" color="error">
                        Yes, cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
