import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axiosApi";
import { Gym, Trainer, TrainerService } from "./TrainersProps";

interface Props {
  open: boolean;
  onClose: () => void;
  trainer?: Trainer;
  onUpdate: (updated: Trainer) => void;
  onDelete?: () => void;
  mode: "create" | "edit";
}

export default function TrainerDialog({ open, onClose, trainer, onUpdate, onDelete, mode }: Props) {
  const [form, setForm] = useState<{
    first_name: string;
    last_name: string;
    bio: string;
    description: string;
    gym_id: number;
    available_services: number[];
    photo: string | File;
  }>({
    first_name: "",
    last_name: "",
    bio: "",
    description: "",
    gym_id: 0,
    available_services: [],
    photo: "",
  });

  const [gyms, setGyms] = useState<Gym[]>([]);
  const [servicesList, setServicesList] = useState<TrainerService[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (open) {
      api.get("/api/gyms/").then((res) => setGyms(res.data));
      api.get("/api/services/").then((res) => setServicesList(res.data));

      if (mode === "edit" && trainer) {
        setForm({
          first_name: trainer.first_name,
          last_name: trainer.last_name,
          bio: trainer.bio,
          description: trainer.description,
          gym_id: trainer.gym_id,
          available_services: trainer.available_services || [],
          photo: trainer.photo,
        });
      } else {
        setForm({
          first_name: "",
          last_name: "",
          bio: "",
          description: "",
          gym_id: 0,
          available_services: [],
          photo: "",
        });
      }
      setErrors({});
    }
  }, [open, trainer, mode]);

  useEffect(() => {
    if (!open) {
      setForm({
        first_name: "",
        last_name: "",
        bio: "",
        description: "",
        gym_id: 0,
        available_services: [],
        photo: "",
      });
      setErrors({});
    }
  }, [open]);

  const handleChange = (field: string, value: string | number | File | number[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("bio", form.bio);
      formData.append("description", form.description);
      formData.append("gym", String(form.gym_id));
      form.available_services.forEach(id => {
        formData.append("available_services", String(id));
      });

      if (form.photo instanceof File) {
        formData.append("photo", form.photo);
      }

      const res =
          mode === "edit" && trainer
              ? await api.patch(`/api/trainers/${trainer.id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
              : await api.post(`/api/trainers/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });

      onUpdate(res.data);
      onClose();
    } catch (err: any) {
      if (err.response?.data) {
        const rawErrors = err.response.data;
        const flatErrors: Record<string, string> = {};
        for (const key in rawErrors) {
          flatErrors[key] = Array.isArray(rawErrors[key])
              ? rawErrors[key].join(" ")
              : String(rawErrors[key]);
        }
        setErrors(flatErrors);
      }
    }
  };

  const handleDeleteConfirmed = async () => {
    if (mode === "edit" && trainer) {
      try {
        await api.delete(`/api/trainers/${trainer.id}/`);
        onDelete?.();
        onClose();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
      <>
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle>{mode === "edit" ? "Edit Trainer" : "Add New Trainer"}</DialogTitle>
          <DialogContent sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                  label="First Name"
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  fullWidth
                  error={!!errors["first_name"]}
                  helperText={errors["first_name"]}
              />

              <TextField
                  label="Last Name"
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  fullWidth
                  error={!!errors["last_name"]}
                  helperText={errors["last_name"]}
              />

              <TextField
                  label="Bio"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors["bio"]}
                  helperText={errors["bio"]}
              />

              <TextField
                  label="Description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors["description"]}
                  helperText={errors["description"]}
              />

              <FormControl fullWidth>
                <InputLabel>Gym</InputLabel>
                <Select
                    value={form.gym_id}
                    label="Gym"
                    onChange={(e) => handleChange("gym_id", e.target.value as number)}
                    error={!!errors["gym"]}
                >
                  {gyms.map((g) => (
                      <MenuItem key={g.id} value={g.id}>
                        {g.name}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Services</InputLabel>
                <Select
                    multiple
                    value={form.available_services}
                    onChange={(e) =>
                        handleChange("available_services", e.target.value as number[])
                    }
                    input={<OutlinedInput label="Services" />}
                    renderValue={(selected) =>
                        servicesList
                            .filter((s) => selected.includes(s.id))
                            .map((s) => s.name)
                            .join(", ")
                    }
                >
                  {servicesList.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        <Checkbox checked={form.available_services.includes(s.id)} />
                        <ListItemText primary={s.name} />
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {mode === "edit" && typeof form.photo === "string" ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold" variant="subtitle1" mb={1}>
                      Current Photo:
                    </Typography>
                    <img
                        src={form.photo}
                        alt="preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 200,
                          objectFit: "contain",
                          borderRadius: 8,
                        }}
                    />
                  </Box>
              ) : mode === "create" && form.photo instanceof File ? (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {form.photo.name}
                  </Typography>
              ) : null}

              <Button variant="outlined" component="label">
                Upload {mode === "edit" ? "New" : ""} Photo
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleChange("photo", e.target.files[0]);
                      }
                    }}
                />
              </Button>
            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
            {mode === "edit" && onDelete && (
                <Button onClick={() => setConfirmDeleteOpen(true)} color="error">
                  Delete Trainer
                </Button>
            )}
            <Box>
              <Button onClick={onClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {mode === "edit" ? "Save" : "Create"}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this trainer? This action is irreversible.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
}
