import {Paper} from '@mui/material';
import {JSX, ReactNode} from "react";

type Props = {
    children: ReactNode;
};


export default function TrainingFormCard({ children }: Props): JSX.Element {
    return (
        <Paper
            elevation={3}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 2,
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
                marginBottom: 2,
                width: '69%',
                minHeight: 600,
                maxHeight: '75vh',
            }}
        >
            {children}
        </Paper>
    );
}


