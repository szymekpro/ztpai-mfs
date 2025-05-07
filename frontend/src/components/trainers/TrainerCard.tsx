import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import api from "../../api/axiosApi";
import EditTrainerDialog from "./EditTrainerDialog";

export interface TrainerCardProps {
  id: number;
  first_name: string;
  last_name: string;
  bio: string;
  photo: string;
  onDelete?: (id: number) => void;
}

export default function TrainerCard({
  id,
  first_name,
  last_name,
  bio,
  photo,
  onDelete
}: TrainerCardProps) {
  const token = localStorage.getItem("access");
  const trainerId = id;

  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [trainerState, setTrainerState] = useState({ bio, first_name, last_name });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this trainer?")) {
      api.delete(`/api/trainers/${trainerId}/`)
        .then(() => {
          if (onDelete) onDelete(trainerId);
        })
        .catch(err => console.error(err));
    }
  };

  const handlePatchSubmit = async (data: { bio: string }) => {
    try {
      const res = await api.patch(`/api/trainers/${trainerId}/`, data);
      setTrainerState((prev) => ({ ...prev, ...res.data }));
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update trainer:", error);
    }
  };

  console.log(trainerId)

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
        backgroundColor: "#f9f9f9",
        position: "relative",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
          cursor: "pointer"
        }
      }}
    >
      {role !== "member" && (
        <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1, zIndex: 1 }}>
          <IconButton size="small" color="primary" onClick={() => setEditDialogOpen(true)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2, backgroundColor: "#fafafa" }}>
        <CardMedia
          component="img"
          image={photo}
          alt={`${trainerState.first_name} ${trainerState.last_name}`}
          sx={{ height: 160, width: "auto", borderRadius: 2, objectFit: "contain" }}
        />
      </Box>

      <CardContent sx={{ textAlign: "left" }}>
        <Typography variant="h6" fontWeight="bold">
          {trainerState.first_name} {trainerState.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {trainerState.bio}
        </Typography>
      </CardContent>

      {role !== "member" && (
        <EditTrainerDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handlePatchSubmit}
          currentBio={trainerState.bio}
        />
      )}
    </Card>
  );
}
