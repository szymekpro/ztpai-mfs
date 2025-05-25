import {Box} from '@mui/material';
import {JSX, ReactNode} from "react";

type Props = {
    children: ReactNode;
};


export default function TrainingsCard({ children }: Props): JSX.Element {
    return (
        <Box
            elevation={3}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 2,
                borderRadius: 2,
                marginBottom: 2,
                width: '100%',
                minHeight: 600,
                maxHeight: '75vh',
            }}
        >
            {children}
        </Box>
    );
}


