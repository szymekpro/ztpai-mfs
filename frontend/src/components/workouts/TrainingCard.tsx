import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import { TrainingHistoryProps } from "GymProps.ts";

export default function TrainingCard({
  training,
  onCancel
}: {
  training: TrainingHistoryProps;
  onCancel?: (trainingId: number) => void;
}) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "strength training":
        return <FitnessCenterIcon />;
      case "bodybuilding training":
        return <AccessibilityIcon />;
      case "crossfit":
        return <GroupsIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#e8f5e9";
      case "cancelled":
        return "#ffebee";
      default:
        return "#f5f5f5";
    }
  };

  const isCancelable =
    training.status === "scheduled" &&
    dayjs(training.start_time).isAfter(dayjs());

  return (
    <Card
      sx={{
        backgroundColor: getBgColor(training.status),
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        paddingTop: 1,
        height: "180px",
        width: "313px",
        position: "relative",
        marginBottom: 1,
      }}
    >
      <CardContent sx={{ height: "100%", paddingBottom: "48px" }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar>{getIcon(training.service_type.name)}</Avatar>
          {console.log(training.service_type.name)}
          <Box>
            <Typography variant="h6">{training.service_type.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs(training.start_time).format("MMMM D, YYYY HH:mm")}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" gutterBottom>
          <strong>Trainer:</strong> {training.trainer.first_name}{" "}
          {training.trainer.last_name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Description:</strong>{" "}
          {training.description || "No description"}
        </Typography>
      </CardContent>

      <Box sx={{ position: "absolute", bottom: 18, left: 16 }}>
        <Chip
          label={training.status.toUpperCase()}
          color={getStatusColor(training.status)}
          size="small"
        />
      </Box>

      {isCancelable && (
        <Box sx={{ position: "absolute", bottom: 18, right: 16 }}>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => onCancel?.(training.id)}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Card>
  );
}
