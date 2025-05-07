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
  onSubmit: (data: { bio: string }) => void;
  currentBio: string;
}

export default function EditTrainerDialog({
  open,
  onClose,
  onSubmit,
  currentBio
}: Props) {
  const [bio, setBio] = useState(currentBio);

  useEffect(() => {
    if (open) {
      setBio(currentBio);
    }
  }, [open, currentBio]);

  const handleSave = () => {
    onSubmit({ bio });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Trainer</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 300 }}
      >
        <TextField
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          fullWidth
          multiline
          minRows={4}
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
