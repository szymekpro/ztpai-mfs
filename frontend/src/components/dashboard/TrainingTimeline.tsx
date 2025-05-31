import { Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";
import { TrainingHistoryProps } from "../workouts/GymProps.ts";
import { startOfWeek, endOfWeek, isWithinInterval, format } from "date-fns";

type Props = {
    trainings: TrainingHistoryProps[];
};

export default function TrainingTimeline({ trainings }: Props) {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    const weekTrainings = trainings.filter(t =>
        isWithinInterval(new Date(t.start_time), {
            start: weekStart,
            end: weekEnd,
        })
    );

    const days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        return {
            date,
            label: format(date, "EEEE, MMM d"),
            trainings: weekTrainings.filter(t =>
                format(new Date(t.start_time), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
            ),
        };
    });

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h6" fontWeight="bold">Weekly Training Timeline</Typography>
            <Divider sx={{ my: 1 }} />

            {days.map(day => (
                <Box key={day.label} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{day.label}</Typography>
                    {day.trainings.length > 0 ? (
                        <List dense>
                            {day.trainings.map(t => (
                                <ListItem key={t.id} sx={{ pl: 0 }}>
                                    <ListItemText
                                        primary={`${format(new Date(t.start_time), "HH:mm")} – ${t.trainer?.first_name ?? "Trainer"}`}
                                        secondary={t.description}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="text.secondary" fontSize={14}>No trainings</Typography>
                    )}
                </Box>
            ))}
        </Box>
    );
}
