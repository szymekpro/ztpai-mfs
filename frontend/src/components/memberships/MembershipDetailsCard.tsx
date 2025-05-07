import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Paper, Grid } from "@mui/material";
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
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        p: 4,
        maxWidth: 1200,
        mx: "auto",
        mt: 4,
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{
        display: 'flex',
      }}>
      <Box sx={{
        flexShrink: 0,
        marginRight: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
            src={membership.membership_type.photo}
            alt={membership.membership_type.name}
            loading="lazy"
            style={{ width: '225px', height: 'auto', borderRadius: '8px' }}
        />
      </Box>

      <Grid container spacing={8} rowSpacing={4}>
        <Grid item xs={12} md={4}>
          <Typography fontSize={14} color="gray">
            Your membership
          </Typography>
          <Typography fontWeight="bold" fontSize={18} mt={1}>
            {membership_type.name}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontSize={14} color="gray">
            Status
          </Typography>
          <Typography fontWeight="bold" fontSize={18} color={is_active ? "green" : "red"} mt={1}>
            {is_active ? "Active" : "Not-active"}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontSize={14} color="gray">
            Date of purchase
          </Typography>
          <Typography fontWeight="bold" mt={1}>
            {start_date}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontSize={14} color="gray">
            Date of activation
          </Typography>
          <Typography fontWeight="bold" mt={1}>
            {start_date}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontSize={14} color="gray">
            Price
          </Typography>
          <Typography fontWeight="bold" fontSize={28} mt={1}>
            {membership_type.price} zł
          </Typography>
        </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
