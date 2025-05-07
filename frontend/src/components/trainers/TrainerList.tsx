import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import TrainerCard, { TrainerCardProps } from "./TrainerCard";
import api from "../../api/axiosApi";

interface Trainer extends TrainerCardProps {
  id: number;
  gym_id: number;
}

export default function TrainerList() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    api
      .get("/api/trainers/")
      .then((res) => setTrainers(res.data))
      .catch((err) => console.error("Failed to fetch trainers:", err));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        justifyContent: "flex-start",
        mt: 4,
      }}
    >
      {trainers.map((trainer) => (

        <TrainerCard
          key={trainer.id}
          first_name={trainer.first_name}
          last_name={trainer.last_name}
          bio={trainer.bio}
          photo={trainer.photo}
        />
      ))}
    </Box>
  );
}
