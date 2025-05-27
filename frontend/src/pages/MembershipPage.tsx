import MembershipCard from "../components/memberships/MembershipCard.tsx";
import MembershipsBox from "../components/memberships/MembershipsBox.tsx";
import {Box, Typography} from "@mui/material";
import MembershipOfferCard from "../components/memberships/MembershipOfferCard.tsx";
import {useEffect, useState} from "react";
import MembershipTypeProp from "../components/memberships/UserMembershipProp.ts";
import api from "../api/axiosApi.ts";
import TrainerCard from "../components/trainers/TrainerCard.tsx";

export default function MembershipsPage() {
    const[membershipTypes, setMembershipTypes] = useState<MembershipTypeProp[]>([])

    useEffect(() => {
        api.get(`/api/membership-types/`)
            .then(res => setMembershipTypes(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <>

            <MembershipsBox>
                <Typography
                    sx={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                    }}
                > Your active memberships:</Typography>

                <MembershipCard/>
                <Typography
                    sx={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                    }}
                > Buy a new membership</Typography>
                <Typography variant="body1" color="text.secondary">
                    Our current offer:
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', mt: 4, width: '100%'}}>
                    {membershipTypes.map((m) => (
                        <MembershipOfferCard
                            key={m.id}
                            id={m.id}
                            name={m.name}
                            description={m.description}
                            price={m.price}
                            duration_days={m.duration_days}
                            photo={m.photo}
                         />
                    ))}
                </Box>

            </MembershipsBox>
        </>
    )
}
