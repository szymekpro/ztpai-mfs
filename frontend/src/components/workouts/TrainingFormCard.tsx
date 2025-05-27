import {Box, IconButton, Paper, Popover, Typography} from '@mui/material';
import {JSX, ReactNode, useState} from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

type Props = {
    children: ReactNode;
};


export default function TrainingFormCard({ children }: Props): JSX.Element {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleInfoClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

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
                width: 600,
                minWidth: 500,
                minHeight: 600,
                maxHeight: 800,
            }}
        >
            <Box sx={{ height: 35, width: 35, alignSelf: 'flex-end', position: 'absolute', }}>
                <Tooltip title="This form allows you to schedule a training session with a trainer.">
                    <IconButton onClick={handleInfoClick} size="small" sx={{ color: "grey.600" }}>
                        <InfoOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        padding: 2,
                        maxWidth: 320,
                        width: 310,
                        bgcolor: "#f9f9f9",
                        boxShadow: 3,
                    }
                }}
            >
                <Box sx={{
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Training scheduling rules
                    </Typography>
                    <Typography variant="body2" gutterBottom>• You must have an active membership.</Typography>
                    <Typography variant="body2" gutterBottom>• Workout will take palce in app selected gym.</Typography>
                    <Typography variant="body2" gutterBottom>• Note that some trainers are available only in certain gyms.</Typography>
                    <Typography variant="body2" gutterBottom>• Cancel at least 1 hour before.</Typography>
                    <Typography variant="body2" gutterBottom>• Be on time.</Typography>
                </Box>
            </Popover>
            {children}
        </Paper>
    );
}


