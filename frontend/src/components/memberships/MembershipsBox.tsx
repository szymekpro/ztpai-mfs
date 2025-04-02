import {Box} from '@mui/material';
import {JSX, ReactNode} from "react";

type Props = {
    children: ReactNode;
};

export default function MembershipsBox({ children }: Props): JSX.Element {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100%',
            height: '100%',
            padding: 2,
        }}>
            {children}
        </Box>
    )
}