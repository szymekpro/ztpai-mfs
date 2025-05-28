import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { status: string; description: string }) => void;
  currentStatus: string;
  currentDescription: string;
}

const statuses = ["paid", "pending", "failed", "refunded"];

export default function EditPaymentDialog({
  open,
  onClose,
  onSubmit,
  currentStatus,
  currentDescription,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [description, setDescription] = useState(currentDescription);

  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      setDescription(currentDescription);
    }
  }, [open, currentStatus, currentDescription]);

  const handleSave = () => {
    onSubmit({ status, description });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Payment</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 300 }}
      >
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          sx={{marginTop: 1}}
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s.toUpperCase()}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={3}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
