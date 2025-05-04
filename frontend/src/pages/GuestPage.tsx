import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import LogoPlaceholder from "../../public/logo-zoom.png";

export default function GuestPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          textAlign: "center",
          width: "100%",
          maxWidth: 600, // zwiększona szerokość
          borderRadius: 3,
        }}
      >
        <Box mb={3}>
          <img
            src={LogoPlaceholder}
            alt="Logo"
            style={{
              maxWidth: 180,
              display: "block",
              margin: "0 auto",
            }}
          />
        </Box>

        <Typography variant="h4" gutterBottom>
          Welcome!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Please log in or create an account to get started.
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center">
          <Button variant="contained" size="large" component={Link} to="/login">
            Login
          </Button>
          <Button variant="outlined" size="large" component={Link} to="/register">
            Register
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}