import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Checkbox, ListItemText, OutlinedInput
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi";
import { useNavigate } from "react-router-dom";
import { Trainer, Gym, TrainerService } from "./TrainersProps";

interface Props {
  open: boolean;
  onClose: () => void;
  trainer: Trainer;
  onUpdate: (trainer: Trainer) => void;
  onDelete: () => void;
}

export default function EditTrainerDialog({ open, onClose, trainer, onUpdate, onDelete }: Props) {
  const [form, setForm] = useState({
    first_name: trainer.first_name,
    last_name: trainer.last_name,
    bio: trainer.bio,
    description: trainer.description,
    gym_id: trainer.gym_id,
    available_services: trainer.available_services || [],
  });

  const [gyms, setGyms] = useState<Gym[]>([]);
  const [servicesList, setServicesList] = useState<TrainerService[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setForm({
        first_name: trainer.first_name,
        last_name: trainer.last_name,
        bio: trainer.bio,
        description: trainer.description,
        gym_id: trainer.gym_id,
        available_services: trainer.available_services || [],
      });
      api.get("/api/gyms/").then(res => setGyms(res.data));
      api.get(`/api/services/`)
        .then(res => setServicesList(res.data));
    }
  }, [open, trainer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        gym: form.gym_id,
        available_services: form.available_services,
      };
      const res = await api.patch(`/api/trainers/${trainer.id}/`, payload);
      onUpdate(res.data);
    } catch (e) {
      console.error("Update failed:", e);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this trainer?")) {
      try {
        await api.delete(`/api/trainers/${trainer.id}/`);
        onDelete();
        navigate("/trainers");
      } catch (e) {
        console.error("Delete failed:", e);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Trainer</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400, mt: 1 }}>
        <TextField name="first_name" label="First Name" value={form.first_name} onChange={handleChange} sx={{marginTop: 1}} />
        <TextField name="last_name" label="Last Name" value={form.last_name} onChange={handleChange} />
        <TextField name="bio" label="Bio" value={form.bio} onChange={handleChange} multiline rows={3} />
        <TextField name="description" label="Description" value={form.description} onChange={handleChange} multiline rows={2} />

        <FormControl fullWidth>
          <InputLabel>Gym</InputLabel>
          <Select
            value={form.gym_id}
            onChange={(e) => setForm(prev => ({ ...prev, gym_id: e.target.value as number }))}
            label="Gym"
          >
            {gyms.map(g => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Services</InputLabel>
          <Select
            multiple
            value={form.available_services}
            onChange={(e) => setForm(prev => ({ ...prev, available_services: e.target.value as number[] }))}
            input={<OutlinedInput label="Services" />}
            renderValue={(selected) =>
              servicesList.filter(s => selected.includes(s.id)).map(s => s.name).join(', ')
            }
          >
            {servicesList.map(s => (
              <MenuItem key={s.id} value={s.id}>
                <Checkbox checked={form.available_services.includes(s.id)} />
                <ListItemText primary={s.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDelete} color="error">Delete</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
