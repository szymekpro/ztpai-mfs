import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {SnackbarProvider} from "./components/navigation/SnackbarProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SnackbarProvider>
                <App />
            </SnackbarProvider>
        </LocalizationProvider>
    </StrictMode>,
)
