import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

export interface TrainerCardProps {
  first_name: string;
  last_name: string;
  bio: string;
  photo: string;
}

export default function TrainerCard({
  first_name,
  last_name,
  bio,
  photo,
}: TrainerCardProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 300,
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          backgroundColor: '#fafafa',
        }}
      >
        <CardMedia
          component="img"
          image={photo}
          alt={`${first_name} ${last_name}`}
          sx={{
            height: 160,
            width: 'auto',
            borderRadius: 2,
            objectFit: 'contain',
          }}
        />
      </Box>

      <CardContent sx={{ textAlign: 'left' }}>
        <Typography variant="h6" fontWeight="bold">
          {first_name} {last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {bio}
        </Typography>
      </CardContent>
    </Card>
  );
}
