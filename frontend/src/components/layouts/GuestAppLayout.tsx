import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function GuestLayout() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Outlet />
        </Box>
    );
}
