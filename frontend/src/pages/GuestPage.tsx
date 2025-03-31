import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function GuestPage() {
    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button variant="contained" component={Link} to="/login">
                Login
            </Button>
            <Button variant="outlined" component={Link} to="/register">
                Register
            </Button>
        </Stack>
    );
}
