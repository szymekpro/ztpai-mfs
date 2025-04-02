// components/layout/AppLayout.tsx
import { Box } from '@mui/material';
import Sidebar from '../navigation/Sidebar.tsx';
import { Outlet } from 'react-router-dom';

export default function MainAppLayout() {
    return (
        <Box sx={{ display: 'flex', margin: 0,}}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor: '#ece9e9',
                    flexGrow: 1,
                    p: 2,
                    margin: 0,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
