import { Box} from "@mui/material";
import Dashboard from "../components/dashboard/Dashboard.tsx";

export default function HomePage() {


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 4, gap: 4 , justifyContent: 'center', alignItems: 'center' }}>
            <Dashboard></Dashboard>
        </Box>
    );
}
