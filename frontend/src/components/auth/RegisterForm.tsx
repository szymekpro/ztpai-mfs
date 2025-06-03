import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Link as MuiLink
} from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosApi";
import LogoPlaceholder from "../../../public/logo-zoom.png";
import { useSnackbar } from "../navigation/SnackbarProvider.tsx";


interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  street: string;
  street_number: string;
  city: string;
  postal_code: string;
}

export default function RegisterForm() {
  const { control, handleSubmit } = useForm<RegisterFormData>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const { showSnackbar } = useSnackbar();


  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await api.post("/api/user/register/", data);
      showSnackbar("Konto zostało utworzone pomyślnie!", "success");
      navigate("/login");
    } catch (error: any) {
      if (error.response?.data) {
        const errors = Object.values(error.response.data).flat().join("\n");
        showSnackbar(errors, "error");
      } else {
        showSnackbar("Błąd rejestracji", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
      name: keyof RegisterFormData,
      label: string,
      type: string = "text"
  ) => (
      <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={{ required: `${label} is required` }}
          render={({ field, fieldState }) => (
              <TextField
                  {...field}
                  label={label}
                  type={type}
                  fullWidth
                  error={!!fieldState.error || !!formErrors[name]}
                  helperText={fieldState.error?.message || formErrors[name]}
              />
          )}
      />
  );


  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}
    >
      <Grid item xs={11} sm={8} md={6} lg={5}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Box textAlign="center" mb={3}>
            <img
              src={LogoPlaceholder}
              alt="Logo"
              style={{ maxWidth: 200 }}
            />
            <Typography variant="h6">Create your account</Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
          >

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderInput("email", "Email", "email")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderInput("password", "Password", "password")}
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderInput("first_name", "First Name")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderInput("last_name", "Last Name")}
              </Grid>
            </Grid>


            {renderInput("phone", "Phone Number")}


            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                {renderInput("street", "Street")}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderInput("street_number", "Street Number")}
              </Grid>
            </Grid>


            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderInput("city", "City")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderInput("postal_code", "Postal Code")}
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </Box>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <MuiLink component={Link} to="/login">
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
