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
            width: '90vw',
            height: 'auto',
            padding: 2,

        }}>
            {children}
        </Box>
    )
}