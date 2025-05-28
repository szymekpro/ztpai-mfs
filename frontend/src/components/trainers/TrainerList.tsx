import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import TrainerCard from "./TrainerCard";
import api from "../../api/axiosApi";
import {Trainer} from "./TrainersProps.ts";

export default function TrainerList() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    api.get('/api/trainers/')
      .then(res => setTrainers(res.data))
      .catch(err => console.error(err));
  }, []);


  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      mt: 4
    }}>
      {trainers.map((trainer) => (
        <TrainerCard
          key={trainer.id}
          id={trainer.id}
          first_name={trainer.first_name}
          last_name={trainer.last_name}
          bio={trainer.bio}
          description={trainer.description}
          photo={trainer.photo}
        />
      ))}
    </Box>
  );
}

