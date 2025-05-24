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

  return (
    <TrainingsCard>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography variant="h6" mb={2}>
          Your Training History:
        </Typography>

        {trainings.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You have no training history.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {trainings.map((training) => (
              <Grid item xs={12} sm={6} md={4} key={training.id}>
                <TrainingCard training={training} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </TrainingsCard>
  );
}
