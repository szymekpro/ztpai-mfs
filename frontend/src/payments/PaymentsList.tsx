import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import api from "../api/axiosApi";
import dayjs from "dayjs";

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
                  <Typography variant="h6" gutterBottom>
                    {payment.description}
                  </Typography>

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
    </Box>
  );
}
