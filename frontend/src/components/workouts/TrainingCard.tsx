import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccessibleIcon from "@mui/icons-material/Accessible";
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import { TrainingHistoryProps } from "GymProps.ts";

export default function TrainingCard({ training }: { training: TrainingHistoryProps }) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "strength":
        return <FitnessCenterIcon />;
      case "physio":
        return <AccessibleIcon />;
      case "group class":
        return <GroupsIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#e8f5e9";
      case "pending":
        return "#fffde7";
      case "cancelled":
      case "failed":
        return "#ffebee";
      default:
        return "#f5f5f5";
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: getBgColor(training.status),
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        height: "180px", width: "250px",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Avatar>
            {getIcon(training.service_type.name)}
          </Avatar>
          <Box>
            <Typography variant="h6">{training.service_type.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs(training.start_time).format("MMMM D, YYYY HH:mm")}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" gutterBottom>
          <strong>Trainer:</strong> {training.trainer.first_name} {training.trainer.last_name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Description:</strong> {training.description || "No description"}
        </Typography>

        <Chip
          label={training.status.toUpperCase()}
          color={getStatusColor(training.status)}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
}
