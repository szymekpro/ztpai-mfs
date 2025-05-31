import { useState } from "react";
import {
    Box,
    Typography,
    Divider,
    IconButton,
    Stack,
    Card,
    CardContent,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
    format,
    addWeeks,
    startOfWeek,
    endOfWeek,
    isWithinInterval
} from "date-fns";
import { TrainingHistoryProps } from "../workouts/GymProps";

type Props = {
    trainings: TrainingHistoryProps[];
};

export default function TrainingTimeline({ trainings }: Props) {
    const [weekOffset, setWeekOffset] = useState(0);

    const today = new Date();
    const currentWeekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
    const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    const weekTrainings = trainings
        .filter(t =>
            isWithinInterval(new Date(t.start_time), {
                start: currentWeekStart,
                end: currentWeekEnd
            })
        )
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return (
        <Box sx={{ width: "100%" }}>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                    Trainings ({format(currentWeekStart, "MMM d")} – {format(currentWeekEnd, "MMM d")})
                </Typography>
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => setWeekOffset(prev => prev - 1)} size="small">
                        <ArrowBackIos fontSize="inherit" />
                    </IconButton>
                    <IconButton onClick={() => setWeekOffset(prev => prev + 1)} size="small">
                        <ArrowForwardIos fontSize="inherit" />
                    </IconButton>
                </Stack>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    gap: 2,
                    px: { xs: 1, sm: 2, md: 4 },
                }}
            >
                {weekTrainings.map((t) => {
                    const date = new Date(t.start_time);
                    const bgColor =
                        t.status === "completed" ? "#e6f4ea" :
                            t.status === "cancelled" ? "#fbe9e7" :
                                "#f4f7fa";

                    return (
                        <Card
                            key={t.id}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "calc(50% - 16px)",
                                    md: "calc(33.333% - 18px)",
                                },
                                bgcolor: bgColor,
                                borderRadius: 3,
                                boxShadow: 1,
                            }}
                        >
                            <CardContent>
                                <Typography fontWeight="bold" fontSize={15}>
                                    {format(date, "EEEE, HH:mm")}
                                </Typography>
                                <Typography fontSize={14} color="text.secondary" sx={{ mb: 2 }}>
                                    {format(date, "MMM d, yyyy")}
                                </Typography>
                                <Typography fontSize={14}>
                                    Coach: {t.trainer?.first_name ?? "Unknown"}
                                </Typography>
                                <Typography fontSize={13} color="text.secondary">
                                    {t.service_type?.name ?? ""}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        </Box>
    );
}
