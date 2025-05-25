import {Box, Paper, Typography} from '@mui/material';
import { useEffect, useState } from "react";
import api from "../../api/axiosApi.ts";
import UserMembership from "./UserMembershipProp.ts"
import {useNavigate} from "react-router-dom";


export default function MembershipCard() {
    const navigate = useNavigate();
    const [memberships, setMemberships] = useState<UserMembership[]>([]);

    useEffect(() => {
        api.get('/api/user-memberships/')
            .then(res => {
                console.log('API response:', res);
                setMemberships(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                width: '100%',
                height: 'auto',
                padding: 2,
                gap: 2,
            }}
            >
                {memberships.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            You have no active memberships.
                        </Typography>
                    ) : (memberships.map((item) => (
                <Paper
                    key={item.id}
                    elevation={3}
                    onClick={() => {
                        navigate(`/memberships/${item.id}`);
                    }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 2,
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5',
                        marginBottom: 2,
                        width: 'auto',
                        maxWidth: 800,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: 6,
                            cursor: 'pointer',
                        },
                    }}
                >
                    <Box sx={{ flexShrink: 0, marginRight: 2 }}>
                        <img
                            src={item.membership_type.photo}
                            alt={item.membership_type.name}
                            loading="lazy"
                            style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="h6">{item.membership_type.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {item.membership_type.description}
                        </Typography>
                        {(item.is_active) ? (
                        <Typography variant="h6" color="success" sx={{ mt: 1 , fontWeight: "bold" }}>
                            Active
                        </Typography>
                        ) : (
                        <Typography variant="h6" color="error" sx={{ mt: 1 , fontWeight: "bold" }}>
                            Not-active
                        </Typography>
                        )}
                    </Box>
                </Paper>
            ))
                )}
        </Box>
        </>
    );
}
