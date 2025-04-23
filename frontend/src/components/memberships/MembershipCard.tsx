import {Box, Paper, Typography} from '@mui/material';
import { useEffect, useState } from "react";
import api from "../../api/axiosApi.ts";

interface UserMembership {
    id: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    membership_type: {
        id: number;
        name: string;
        description: string;
        duration_days: number;
        price: string;
        photo: string;
    };
}

export default function MembershipCard() {
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
                        <Typography sx={{ mt: 1 }}>
                            <strong>Timestamp:</strong> {item.start_date} – {item.end_date}
                        </Typography>
                    </Box>
                </Paper>
            ))
                )}
        </Box>
        </>
    );
}
