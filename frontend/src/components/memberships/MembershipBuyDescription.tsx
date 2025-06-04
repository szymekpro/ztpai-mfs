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
import { useSnackbar } from "../navigation/SnackbarProvider.tsx";
import { User } from "../user/UserProps.ts";


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
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();


    useEffect(() => {
      if (!id) return;

      const fetchData = async () => {
        try {
          const [membershipRes, userRes] = await Promise.all([
            api.get(`/api/membership-types/${id}/`),
            api.get("/api/users/me/"),
          ]);
          setMembership(membershipRes.data);
          setUser(userRes.data);
        } catch (err) {
          console.error("Failed to fetch data:", err);
        }
      };

      fetchData();
}, [id]);

    const handleBuy = async () => {
        if (!membership) return;

        const start = dayjs().format("YYYY-MM-DD");
        const end = dayjs().add(membership.duration_days, "day").format("YYYY-MM-DD");

        try {
            await api.post("/api/user-memberships/", {
                membership_type_id: membership.id,
                start_date: start,
                end_date: end,
                is_active: true,
            });
            showSnackbar("Membership purchased. Pending payment created.", "success");
            navigate("/memberships");
        } catch (error: any) {
            console.error("Error response:", error.response?.data);

            const fallback = "Purchase failed.";
            const msg =
                error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.detail ||
                (typeof error.response?.data === "string" ? error.response.data : null) ||
                fallback;

            showSnackbar(msg, "error");
        }

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
    <Box sx={{ maxWidth: 700, mt: 2, alignSelf: "center", justifyContent: "center" }}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight="medium" gutterBottom>
        Included Features:
      </Typography>
      <Box sx={{display:'flex', flexDirection:'column', gap: 1}}>{renderFeatures(membership.features_description)}</Box>
        <Divider sx={{ my: 2 }} />
         <Button
          variant="contained"
          disabled={!user?.is_student && membership.name === 'Student'}
          fullWidth
          sx={{ mb: 3, backgroundColor: "#1d7ecd" }}
          onClick={handleBuy}
        >
          Buy Now
        </Button>
        {membership.name === 'Student' &&
            <Button
                variant="outlined"
                disabled={user?.is_student}
                onClick={async () => {
                    try {
                        await api.post("/api/users/request_student_status/");
                        showSnackbar("Request sent. Await verification.", "success");
                    } catch (e) {
                        showSnackbar("Failed to send request.", "error");
                    }
                }}
                sx={{width:'100%', marginBottom: 2}}
            >
                Request student verification
            </Button>
        }
    </Box>
  );
}
