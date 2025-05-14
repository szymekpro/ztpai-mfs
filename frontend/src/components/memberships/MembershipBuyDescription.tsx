import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemIcon,
    Paper, Button
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import api from "../../api/axiosApi.ts";
import dayjs from "dayjs";

interface MembershipType {
  id: number;
  name: string;
  duration_days: string;
  description: string;
  features_description: string;
}

export default function MembershipBuyDescription() {
  const { id } = useParams();
  const [membership, setMembership] = useState<MembershipType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/membership-types/${id}/`)
      .then((res) => setMembership(res.data))
      .catch((err) => console.error("Failed to fetch membership type:", err));
  }, [id]);

  const handleBuy = () => {

  if (!membership) return;

  const start = dayjs().format("YYYY-MM-DD");
  const end = dayjs().add(membership.duration_days, "day").format("YYYY-MM-DD");

  api.post("/api/user-memberships/", {
    membership_type_id: membership.id,
    start_date: start,
    end_date: end,
    is_active: true
  })
    .then(() => {
      alert("Membership purchased. Pending payment created.");
      navigate("/memberships");
    })
    .catch((err) => console.error("Failed to purchase membership:", err));
};

  const renderFeatures = (featuresText: string) => {
    return featuresText
      .split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line, idx) => (
        <Paper
          key={idx}
          elevation={1}
          sx={{
            mb: 1,
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "#f5f7fa"
          }}
        >
          <CheckCircleOutlineIcon sx={{ color: "#1d7ecd" }} />
          <Typography fontSize={15}>{line.replace(/^-/, "").trim()}</Typography>
        </Paper>
      ));
  };

  if (!membership) {
    return <Typography>Loading membership details...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 700, mt: 2, alignSelf: "center" }}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight="medium" gutterBottom>
        Included Features:
      </Typography>
      <Box sx={{display:'flex', flexDirection:'column', gap: 1}}>{renderFeatures(membership.features_description)}</Box>
        <Divider sx={{ my: 2 }} />
         <Button
          variant="contained"
          fullWidth
          sx={{ mb: 3, backgroundColor: "#1d7ecd" }}
          onClick={handleBuy}
        >
          Buy Now
        </Button>
    </Box>
  );
}
