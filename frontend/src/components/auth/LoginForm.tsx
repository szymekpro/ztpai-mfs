import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
  Link as MuiLink
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../api/const";
import LogoPlaceholder from "../../../public/logo-zoom.png";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await api.post("/api/token/", data); // zmień endpoint jeśli inny
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/home");
    } catch (error) {
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}
    >
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{
          padding: 4,
          borderRadius: 2,
          height: 600,
          width: 400,
        }}>
          <Box textAlign="center" mt={4} mb={3}>
            <img
                src={LogoPlaceholder}
                alt="Logo"
                style={{
                  maxWidth: 180,
                  display: "block",
                  margin: "0 auto",
                }}
            />
            <Typography variant="h5" mt={4}>Sign in</Typography>
          </Box>

          <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              display="flex"
              flexDirection="column"
            gap={4}
          >
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: "Email is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: "Password is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{height: 60, width: 200, alignSelf: 'center'}}>
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Box>

          <Box mt={4} textAlign="center">
            <Typography variant="body1">
              Don’t have an account?{" "}
              <MuiLink component={Link} to="/register">
                Register
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
