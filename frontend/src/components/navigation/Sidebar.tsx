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
    Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {FitnessCenter, CardMembership, Logout, Rowing, Sports} from '@mui/icons-material';
import { NavLink, useLocation} from 'react-router-dom';


const drawerWidth = 240;

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    const iconStyle = { fontSize: 30};
    const switchIconStyle = { fontSize: 30, color: '#FFFBD8'};

    const gymName = localStorage.getItem("selectedGymName");

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
                    height: 96,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 1,
                }}
            >
                <IconButton
                    onClick={toggleDrawer}
                    sx={{
                        position: 'absolute',
                        left: 12,
                        zIndex: 2,
                    }}
                >
                    {open ? <ChevronLeftIcon sx={switchIconStyle} /> : <MenuIcon sx={switchIconStyle} />}
                </IconButton>

                {open && (
                    <Box
                        sx={{
                            color: '#FFFBD8',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                        }}
                    >
                        <img src="/logo.png" alt="Logo" style={{ height: '128px', objectFit: 'contain' }} />
                    </Box>
                )}
            </Box>

            <Divider />

            <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {[
                    { text: 'Home', icon: <HomeIcon sx={iconStyle}/> , to: "/home"},
                    { text: 'Memberships', icon: <CardMembership sx={iconStyle}/>, to: "/memberships" },
                    { text: 'Workouts', icon: <Rowing sx={iconStyle}/>, to: "/workouts" },
                    { text: 'Trainers', icon: <Sports sx={iconStyle}/>, to: "/trainers" },
                    { text: gymName || 'Gym: Not selected', icon: <FitnessCenter sx={iconStyle}/>, to: "/gyms" },
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

                <ListItem disablePadding sx={{ display: 'block', mt: 'auto' }}>
                    <Tooltip title={!open ? 'Logout' : ''} placement="right">
                        <ListItemButton
                            component={NavLink}
                            to="/logout"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                backgroundColor: '#619fd2',
                                '& .MuiListItemIcon-root': {
                                    fontSize: 44,
                                    color: '#FFFBD8',
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
                                <Logout sx={{ fontSize: 30 }}/>
                            </ListItemIcon>

                            <ListItemText
                                primary="Logout"
                                sx={{
                                    opacity: open ? 1 : 0,
                                    color: '#FFFBD8',
                                }}
                            />
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            </List>

        </Drawer>
    );
}
