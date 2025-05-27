import { Box, Typography, Grid } from "@mui/material";
import TrainingsCard from "./TrainingsCard.tsx";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi.ts";
import { TrainingHistoryProps, TrainerServices } from "GymProps.ts";
import TrainingCard from "./TrainingCard.tsx"; // <-- dodaj import

export default function TrainingHistory() {
  const [trainings, setTrainings] = useState<TrainingHistoryProps[]>([]);
  const [services, setServices] = useState<TrainerServices[]>([]);

  useEffect(() => {
    api.get("/api/trainings/")
      .then((res) => {
        setTrainings(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCancelTraining = (trainingId: number) => {
  if (!window.confirm("Are you sure you want to cancel this training?")) return;

  api.patch(`/api/trainings/${trainingId}/`, { status: "cancelled" })
    .then(() => {
      setTrainings((prev) =>
        prev.map((t) =>
          t.id === trainingId ? { ...t, status: "cancelled" } : t
        )
      );
    })
    .catch((err) => console.error("Failed to cancel training:", err));
};



  return (
      <Box sx={{
          display: "flex",
          flexDirection: "column",
          width: '95vw',
          minWidth: 330,
          height: "auto",
          overflow: "auto",
          alignItems: "center",
          "&::-webkit-scrollbar": {
              width: 6,
          },
          "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#aaa",
          },
      }}>
        <Typography variant="h6" mb={2} sx={{alignSelf: "flex-start"}} >
          Your Training History:
        </Typography>

        {trainings.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You have no training history.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {trainings.map((training) => (
              <Grid item xs={12} sm={6} md={4} key={training.id}>
                <TrainingCard training={training} onCancel={handleCancelTraining}/>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
  );
}
