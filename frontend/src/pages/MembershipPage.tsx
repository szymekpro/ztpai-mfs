import MembershipCard from "../components/memberships/MembershipCard.tsx";
import MembershipsBox from "../components/memberships/MembershipsBox.tsx";
import {Typography} from "@mui/material";

export default function MembershipsPage() {

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
            </MembershipsBox>
        </>
    )
}
