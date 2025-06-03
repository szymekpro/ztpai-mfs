import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import TrainerCard from "./TrainerCard";
import TrainerDialog from "./EditTrainerDialog.tsx";
import api from "../../api/axiosApi";
import { Trainer } from "./TrainersProps";

export default function TrainerList() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = () => {
        api.get('/api/trainers/')
            .then(res => setTrainers(res.data))
            .catch(err => console.error(err));
    };

    const handleAddTrainer = (newTrainer: Trainer) => {
        setTrainers(prev => [...prev, newTrainer]);
        setAddDialogOpen(false);
    };

    return (
        <Box sx={{ px: 4, mt: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                    mb: 6
                }}
            >
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

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="outlined"  sx={{width:150, height:50}} onClick={() => setAddDialogOpen(true)}>
                    Add Trainer
                </Button>
            </Box>

            <TrainerDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                mode="create"
                onUpdate={handleAddTrainer}
            />
        </Box>
    );
}
