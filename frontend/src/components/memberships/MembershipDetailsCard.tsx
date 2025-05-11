import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Box, Typography, Button, Paper, Grid, Divider} from "@mui/material";
import api from "../../api/axiosApi.ts";
import UserMembership from "./UserMembershipProp.ts";

export default function MembershipDetailsCard() {
  const { id } = useParams();
  const [membership, setMembership] = useState<UserMembership | null>(null);

  useEffect(() => {
    api
      .get(`/api/user-memberships/${id}/`)
      .then((res) => setMembership(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!membership) return <Typography>Loading...</Typography>;

  const { start_date, end_date, is_active, membership_type } = membership;

  return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
    <Paper
    elevation={3}
    sx={{
      borderRadius: 4,
      p: 6,
      maxWidth: 1500,
      ml: 0,
        mr: 4,
      mt: 6,
      mb: 6,
      backgroundColor: "#fff",
    }}
  >
  <Box sx={{ display: "flex", height: "100%" }}>
    <Box
      sx={{
        flexShrink: 0,
        marginRight: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={membership.membership_type.photo}
        alt={membership.membership_type.name}
        loading="lazy"
        style={{
          width: "320px",
          height: "auto",
          borderRadius: "12px",
        }}
      />
    </Box>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 6,
        flexGrow: 1,
        minWidth: 510,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 6,
        }}
      >
        <Grid item xs={12} md={4} sx={{width: 'auto'}}>
          <Typography fontSize={16} color="gray">
            Your membership
          </Typography>
          <Typography fontWeight="bold" fontSize={22} mt={1}>
            {membership_type.name}
          </Typography>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs={12} md={4}>
          <Typography fontSize={16} color="gray">
            Status
          </Typography>
          <Typography
            fontWeight="bold"
            fontSize={22}
            color={is_active ? "green" : "red"}
            mt={1}
          >
            {is_active ? "Active" : "Not-active"}
          </Typography>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs={12} md={4}>
          <Typography fontSize={16} color="gray">
            Date of purchase
          </Typography>
          <Typography fontWeight="bold" fontSize={18} mt={1}>
            {start_date}
          </Typography>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 6,
        }}
      >
        <Grid item xs={12} md={4}>
          <Typography fontSize={16} color="gray">
            Date of activation
          </Typography>
          <Typography fontWeight="bold" fontSize={18} mt={1}>
            {start_date}
          </Typography>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs={12} md={4}>
          <Typography fontSize={16} color="gray">
            Price
          </Typography>
          <Typography fontWeight="bold" fontSize={32} mt={1}>
            {membership_type.price} zł
          </Typography>
        </Grid>
        </Box>
      </Box>
    </Box>
  </Paper>
    <Box sx={{display: 'flex', gap:4, height: 42, width: 'auto'}}>
          <Button variant="contained" sx={{
              backgroundColor: '#1976d2',
              color: '#fff',
              height: 48,
              width: 160,
                '&:hover': {
                    backgroundColor: '#115293',
              }}}>
              Terms of use
          </Button>
          <Button variant="contained" sx={{
              backgroundColor: '#1976d2',
              color: '#fff',
              height: 48,
              width: 196,
              '&:hover': {
                    backgroundColor: '#115293',
              }
        }}>
              Check our offer
          </Button>

    </Box>
      </Box>

  );
}
