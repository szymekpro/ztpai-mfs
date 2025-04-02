// components/layout/AppLayout.tsx
import { Box } from '@mui/material';
import Sidebar from '../navigation/Sidebar.tsx';
import { Outlet } from 'react-router-dom';

export default function MainAppLayout() {
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                overflow: 'auto',
                backgroundColor: '#ece9e9',
            }}
        >
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    p: 2,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

