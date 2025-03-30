import { useState } from 'react';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {FitnessCenter, CardMembership} from '@mui/icons-material';
import { NavLink, useLocation} from 'react-router-dom';


const drawerWidth = 240;

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    const iconStyle = { fontSize: 30};
    const switchIconStyle = { fontSize: 30, color: '#FFFBD8'};

    const location = useLocation();

    const toggleDrawer = () => setOpen((prev) => !prev);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: open ? drawerWidth : 70,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                transition: 'width 0.3s',
                '& .MuiDrawer-paper': {
                    width: open ? drawerWidth : 70,
                    transition: 'width 0.3s',
                    overflowX: 'hidden',
                    backgroundColor: '#619fd2',
                    borderRadius: '0 10px 10px 0',
                    border: 'none',
                },
            }}
        >
            <Box
                sx={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'flex-end' : 'center',
                    px: 1,
                }}
            >
                <IconButton onClick={toggleDrawer}>
                    {open ? <ChevronLeftIcon sx={switchIconStyle}/> : <MenuIcon sx={switchIconStyle} />}
                </IconButton>
            </Box>

            <Divider />

            <List>
                {[
                    { text: 'Home', icon: <HomeIcon sx={iconStyle}/> , to: "/"},
                    { text: 'Memberships', icon: <CardMembership sx={iconStyle}/>, to: "/memberships" },
                    { text: 'Our Gyms', icon: <FitnessCenter sx={iconStyle}/>, to: "/gyms" },
                    { text: 'Payments', icon: <CreditCardIcon sx={iconStyle}/>, to: "/payments" },
                ].map(({ text, icon, to }) => {

                    const isActive = location.pathname === to;

                    return (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <Tooltip title={!open ? text : ''} placement="right">
                                <ListItemButton
                                    component={NavLink}
                                    to={to}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                        borderRadius: isActive ? '10px 0 0 10px' : undefined,
                                        backgroundColor: isActive ? '#FFFBD8' : '#619fd2',
                                        '& .MuiListItemIcon-root': {
                                            fontSize: 44,
                                            color: isActive ? '#4b4b4b' : '#FFFBD8',
                                        },
                                        '&:hover': {
                                            backgroundColor: '#5291c6',
                                            borderRadius: '10px 0 0 10px'
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={text}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            color: isActive ? '#4b4b4b' : '#FFFBD8',
                                        }}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
}
