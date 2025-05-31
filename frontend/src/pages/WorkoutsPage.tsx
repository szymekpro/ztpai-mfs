import { Box, Button } from "@mui/material";
import TrainingHistory from "../components/workouts/TrainingHistory.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosApi.ts";

export default function WorkoutsPage() {
    const navigate = useNavigate();
    const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);

    useEffect(() => {
        api.get(`api/user-memberships/active/`)
            .then((res) => setHasActiveMembership(res.data.has_membership))
            .catch(() => setHasActiveMembership(false));
    }, []);

    console.log(hasActiveMembership);

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 6,
                flexDirection: "row",
                padding: 4,
            }}
        >
            <TrainingHistory />

            <span
                style={{ display: "inline-block" }}
                title={
                    hasActiveMembership === false
                        ? "You need an active membership to schedule a workout."
                        : ""
                }
            >
        <Button
            variant="contained"
            color="info"
            disabled={!hasActiveMembership}
            onClick={() => navigate("/schedule-workout")}
            sx={{
                alignSelf: "flex-start",
                height: 60,
                width: 280,
                backgroundColor: !hasActiveMembership ? "#ccc" : "#1976d2",
                color: "#fff",
                "&:hover": {
                    backgroundColor: !hasActiveMembership ? "#bbb" : "#115293",
                    cursor: !hasActiveMembership ? "not-allowed" : "pointer",
                },
            }}
        >
          Schedule a new workout
        </Button>
      </span>
        </Box>
    );
}
