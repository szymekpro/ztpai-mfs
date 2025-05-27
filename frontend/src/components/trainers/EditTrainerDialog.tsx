import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { description: string }) => void;
  currentDescription: string;
}

export default function EditTrainerDialog({
  open,
  onClose,
  onSubmit,
  currentDescription
}: Props) {
  const [description, setDescription] = useState(currentDescription);

  useEffect(() => {
    if (open) {
      setDescription(currentDescription);
    }
  }, [open, currentDescription]);

  const handleSave = () => {
    onSubmit({ description });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Trainer</DialogTitle>

      <DialogContent
        sx={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 1,
          minWidth: 300,
          minHeight: 170,
        }}
      >
        <TextField
          label="Bio"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={4}
          sx={{marginTop: 2}}
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
