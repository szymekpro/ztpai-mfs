import MembershipBuyCard from "../components/memberships/MembershipBuyCard.tsx"
import MembershipBuyDescription from "../components/memberships/MembershipBuyDescription.tsx"
import {Box} from "@mui/material";

export default function MembershipBuyPage() {


    return (
        <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column",width: "100%", height: "100%"}}>
            <MembershipBuyCard>

            </MembershipBuyCard>
            <MembershipBuyDescription>

            </MembershipBuyDescription>
        </Box>
    )
}