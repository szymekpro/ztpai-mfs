import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { TrainerCardProps } from "./TrainersProps.ts";
import {useNavigate} from "react-router-dom";


export default function TrainerCard({
  id,
  first_name,
  last_name,
  bio,
  description,
  photo,
}: TrainerCardProps) {
  const token = localStorage.getItem("access");
  const trainerId = id;
  const navigate = useNavigate();

  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const [trainerState] = useState({ bio, description, first_name, last_name });

  return (
    <Card
        onClick={() => navigate(`/trainers/${trainerId}`)}
        sx={{
            flex: "1 1 325px",
            minWidth: 260,
            maxWidth: 450,
            height: 380,
            display: "flex",
            flexDirection: "column",
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
        <Box sx={{
          display: "flex",
          zIndex: 1,
          alignSelf: "flex-end",
          height: 20,
          mr: 1,
          mt: 1
        }}>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1, backgroundColor: "#fafafa" }}>
        <CardMedia
          component="img"
          image={photo}
          alt={`${trainerState.first_name} ${trainerState.last_name}`}
          sx={{ height: 250, width: "auto", borderRadius: 2, objectFit: "contain" }}
        />
      </Box>

      <CardContent sx={{ textAlign: "left"}}>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          {trainerState.first_name} {trainerState.last_name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {trainerState.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
