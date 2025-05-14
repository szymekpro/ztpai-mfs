import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {Box, Typography, Card, CardContent, CardMedia, Button, Divider, CircularProgress} from "@mui/material";
import api from "../../api/axiosApi.ts";

interface MembershipType {
  id: number;
  name: string;
  description: string;
  duration_days: number;
  price: string;
  photo: string;
}

export default function MembershipBuyPage() {
  const { id } = useParams();
  const [membership, setMembership] = useState<MembershipType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api.get(`/api/membership-types/${id}/`)
      .then((res) => setMembership(res.data))
      .catch((err) => console.error("Failed to fetch membership:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <CircularProgress sx={{ mt: 8 }} />;
  }

  if (!membership) {
    return <Typography mt={4}>Membership not found.</Typography>;
  }

  return (
    <Card
      elevation={4}
      sx={{
        maxWidth: 400,
        minWidth: 300,
        maxHeight: 545,
        mx: "auto",
        borderRadius: 4,
        overflow: "hidden",
        p: 2,
      }}
    >
      <CardMedia
        component="img"
        image={membership.photo}
        alt={membership.name}
        sx={{ height: 300, objectFit: "cover" , borderRadius: 4}}
      />

      <CardContent>
        <Typography variant="h5" fontWeight="bold">
          {membership.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {membership.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Duration:</Typography>
          <Typography>{membership.duration_days} days</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography>Price:</Typography>
          <Typography variant="h4" fontWeight="bold">{membership.price} zł</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

