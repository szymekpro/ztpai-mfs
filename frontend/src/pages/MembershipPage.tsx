import MembershipCard from "../components/memberships/MembershipCard.tsx";
import MembershipsBox from "../components/memberships/MembershipsBox.tsx";
import {Box, Typography} from "@mui/material";
import MembershipOfferCard from "../components/memberships/MembershipOfferCard.tsx";
import {useEffect, useState} from "react";
import MembershipTypeProp from "../components/memberships/UserMembershipProp.ts";
import api from "../api/axiosApi.ts";
import {useUserRole} from "../hooks/useUserRole.ts";
import MiniMembershipCard from "../components/memberships/MiniMembershipCard.tsx";

export default function MembershipsPage() {
    const[membershipTypes, setMembershipTypes] = useState<MembershipTypeProp[]>([])
    const {role} = useUserRole()

    useEffect(() => {
        api.get(`/api/membership-types/`)
            .then(res => setMembershipTypes(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <>

            <MembershipsBox>
                {role === "member" ? (
                    <Typography variant="h5"
                        sx={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                        }}
                    > Your memberships:</Typography>
                ) : (
                    <Typography variant="h5"
                                sx={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    marginBottom: '16px',
                                }}
                    > Users memberships:</Typography>
                )}
                {role === "member" ? (
                    <MembershipCard/>
                ) : (
                    <MiniMembershipCard/>
                )}
                {role === "member" && (
                    <><Box sx={{display: 'flex', flexDirection: "row", alignItems: 'center',}}>
                        <Typography variant="h5"
                                    sx={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                    }}
                        > Our current membership offer: </Typography>
                    </Box><Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        justifyContent: 'center',
                        mt: 4,
                        width: '100%'
                    }}>
                        {membershipTypes.map((m) => (
                            <MembershipOfferCard
                                key={m.id}
                                id={m.id}
                                name={m.name}
                                description={m.description}
                                price={m.price}
                                duration_days={m.duration_days}
                                photo={m.photo}/>
                        ))}
                    </Box></>
            )}

            </MembershipsBox>
        </>
    )
}
