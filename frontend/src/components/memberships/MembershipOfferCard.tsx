import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MembershipTypeProps from "./UserMembershipProp.ts"

export default function MembershipOfferCard({
  id,
  name,
  description,
  price,
  duration_days,
  photo,
}: MembershipTypeProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: 400, minWidth: 290, height: 350, borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
      <CardMedia
        component="img"
        image={photo}
        alt={name}
        height="180"
        padding={4}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold">{name}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>{price} zł</strong> / {duration_days} days
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button fullWidth variant="contained" onClick={() => navigate(`/memberships/buy/${id}`)}>
            Buy now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
