import {useEffect, useState} from "react";
import {TrainingHistoryProps} from "../workouts/GymProps.ts";
import {Payment} from "../../payments/PaymentProps.ts";
import {UserMembership} from "../memberships/UserMembershipProp.ts";
import api from "../../api/axiosApi.ts";
import {Box, Card, CardContent, Chip, CircularProgress, Divider, Typography} from "@mui/material";
import {User} from "../user/UserProps.ts"
import TrainingTimeline from "./TrainingTimeline.tsx";


export default function Dashboard() {
    const [membership, setMembership] = useState<UserMembership[]>([]);
    const [trainings, setTrainings] = useState<TrainingHistoryProps[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [membershipRes, trainingsRes, paymentsRes, userRes] = await Promise.all([
                    api.get("/api/user-memberships/"),
                    api.get("/api/trainings/"),
                    api.get("/api/payments/"),
                    api.get("/api/users/me/"),
                ]);
                setMembership(membershipRes.data);
                setTrainings(trainingsRes.data);
                setPayments(paymentsRes.data);
                setUser(userRes.data);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '65%', gap: 4 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#f8fafc',
                borderRadius: 3,
                boxShadow: 2,
                p: 3,
            }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" mb={2}>Welcome, {user?.first_name}</Typography>
                    <Typography color="text.secondary">Check your current memberships, training schedule and payments.</Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    width: '100%',
                }}
            >
                <Card sx={{
                    width: { xs: '100%', md: '50%' },
                    minHeight: 220,
                    bgcolor: '#f8fafc',
                    borderRadius: 6,
                    boxShadow: 2,
                }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold">Memberships</Typography>
                        <Divider sx={{ my: 1 }} />

                        {membership.length > 0 ? (
                            <>
                                <Typography sx={{ mb: 2 }}>
                                    You have <strong>{membership.filter(m => m.is_active).length}</strong> active membership
                                    {membership.filter(m => m.is_active).length !== 1 ? "s" : ""}.
                                </Typography>

                                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                    {membership
                                        .filter(m => m.is_active)
                                        .map((m) => (
                                            <Box
                                                key={m.id}
                                                component="li"
                                                sx={{
                                                    m: '12px 32px 0 32px',
                                                    p: 1.5,
                                                    borderRadius: 5,
                                                    bgcolor: '#e6f4ea',
                                                    minHeight: 50,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">{m.membership_type.name}</Typography>
                                                        <Typography fontSize={13} color="text.secondary">
                                                            {new Date(m.start_date).toLocaleDateString()} – {new Date(m.end_date).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    {membership.filter(m => m.is_active).length === 0 && (
                                        <Typography>No active memberships.</Typography>
                                    )}
                                </Box>
                            </>
                        ) : (
                            <Typography>No memberships found.</Typography>
                        )}
                    </CardContent>
                </Card>



                <Card sx={{
                    width: { xs: '100%', md: '50%' },
                    minHeight: 220,
                    bgcolor: '#f8fafc',
                    borderRadius: 6,
                    boxShadow: 2,
                }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold">Last Payments</Typography>
                        <Divider sx={{ my: 1 }} />

                        {payments.filter(p => p.status === "pending").length > 0 && (
                            <Typography color="warning.main" sx={{ mb: 2 }}>
                                You have <strong>{payments.filter(p => p.status === "pending").length}</strong> pending payment(s)!
                            </Typography>
                        )}

                        {payments.length > 0 ? (
                            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                {payments.slice(0, 3).map((p) => {
                                    const bgColor = p.status === "paid"
                                        ? '#e6f4ea'
                                        : p.status === "pending"
                                            ? '#f4e5ce'
                                            : '#d6d6d6';
                                    return (
                                        <Box
                                            key={p.id}
                                            component="li"
                                            sx={{
                                                mb: 1.5,
                                                p: 1.5,
                                                m: '12px 32px 0 32px',
                                                borderRadius: 5,
                                                bgcolor: bgColor,
                                                minHeight: 50
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="subtitle1">{p.description}</Typography>
                                                <Typography fontWeight="bold" sx={{ minWidth: 80, textAlign: 'right' }}>
                                                    {p.amount} zł
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        ) : (
                            <Typography>No payments yet.</Typography>
                        )}
                    </CardContent>
                </Card>
            </Box>

            <Card sx={{ width: '100%', minHeight: 180, bgcolor: '#f8fafc', borderRadius: 5, boxShadow: 2 }}>
                <CardContent>
                    <TrainingTimeline trainings={trainings} />
                </CardContent>
            </Card>
        </Box>
    );
}