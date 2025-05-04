import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import api from "../api/axiosApi";
import EditPaymentDialog from "./EditPaymentDialog.tsx";

interface Payment {
  id: number;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  description: string;
  created_at: string;
}

export default function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/api/payments/");
        setPayments(res.data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "refunded":
        return "default";
    }
  };

  const handleEditClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditDialogOpen(true);
  };

  const handlePatchSubmit = async (data: { status: string; description: string }) => {
    if (!selectedPayment) return;
    try {
      const res = await api.patch(`/api/payments/${selectedPayment.id}/`, data);
      setPayments((prev) =>
        prev.map((p) => (p.id === selectedPayment.id ? { ...p, ...res.data } : p))
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update payment:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payment History
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : payments.length === 0 ? (
        <Typography>No payments found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {payments.map((payment) => (
            <Grid item xs={12} sm={6} md={4} key={payment.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h6">
                      {payment.description || "No description"}
                    </Typography>
                    <IconButton onClick={() => handleEditClick(payment)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="body1" fontWeight={600}>
                    {Number(payment.amount).toFixed(2)} PLN
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {dayjs(payment.created_at).format("YYYY-MM-DD HH:mm")}
                  </Typography>

                  <Chip
                    label={payment.status.toUpperCase()}
                    color={getStatusColor(payment.status)}
                    variant="outlined"
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <EditPaymentDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handlePatchSubmit}
        currentStatus={selectedPayment?.status || ""}
        currentDescription={selectedPayment?.description || ""}
      />
    </Box>
  );
}
