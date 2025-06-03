import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton, Button, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import api from "../api/axiosApi";
import EditPaymentDialog from "./EditPaymentDialog.tsx";
import {useUserRole} from "../hooks/useUserRole.ts";
import {Payment} from "./PaymentProps.ts"


export default function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const currentMonth = dayjs().format("YYYY-MM");
  const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
  const [showOnlyPending, setShowOnlyPending] = useState(false);


  const startDate = dayjs("2025-03-01");
  const now = dayjs();

  const monthsList: string[] = [];
  let current = startDate.startOf("month");

  while (current.isBefore(now, "month") || current.isSame(now, "month")) {
    monthsList.push(current.format("YYYY-MM"));
    current = current.add(1, "month");
  }

  const { role} = useUserRole();

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

  const handleMockPay = async (paymentId: number) => {
  try {
      const res = await api.patch(`/api/payments/${paymentId}/`, {
        status: "paid"
      });
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, ...res.data } : p))
      );
    } catch (err) {
      console.error("Failed to mock pay:", err);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const isSameMonth = dayjs(payment.created_at).format("YYYY-MM") === monthFilter;
    const isPending = showOnlyPending ? payment.status === "pending" : true;
    return isSameMonth && isPending;
  });


  return (
    <Box sx={{ p: 4 , display: 'flex', flexDirection: 'column'}}>
      <Typography variant="h5" gutterBottom mb={2}>
        Payment history:
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : payments.length === 0 ? (
        <Typography>No payments found.</Typography>
      ) : (
        <Grid container spacing={2} direction="column" sx={{width: '90vw'}}>
          <FormControl sx={{ mb: 1, width: 200 }}>
            <InputLabel>Month</InputLabel>
            <Select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                label="Month"
            >
              {monthsList.map((month) => (
                  <MenuItem key={month} value={month}>
                    {dayjs(month).format("MMMM YYYY")}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
              variant={showOnlyPending ? "contained" : "outlined"}
              color="warning"
              onClick={() => setShowOnlyPending((prev) => !prev)}
              sx={{ mb: 2, alignSelf: 'flex-start' }}
          >
            {showOnlyPending ? "Show all payments" : "Show only pending"}
          </Button>

          {filteredPayments .map((payment) => (
  <Grid item xs={12} key={payment.id}>
    <Box
      sx={{
        display: "flex",
        width: '100%',
        overflow: "hidden",
        "&:hover .details-panel": {
          transform: "translateX(0)",
          opacity: 1,
          visibility: "visible",
        },
      }}
    >
      <Card elevation={2} sx={{ flex: "1 0 60%" }}>
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
            {role !== "member" && (
              <IconButton onClick={() => handleEditClick(payment)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Typography variant="body1" fontWeight={600}>
            {Number(payment.amount).toFixed(2)} PLN
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            {dayjs(payment.created_at).format("YYYY-MM-DD HH:mm")}
          </Typography>

          {role !== "member" && payment.user && (
              <Typography variant="body2" color="text.secondary">
                User: {payment.user.first_name} {payment.user.last_name} ({payment.user.email})
              </Typography>
          )}

          <Box sx={ {display: 'flex', flexDirection: "row", alignItems: "center", marginTop: 1}}>
            <Chip
              label={payment.status.toUpperCase()}
              color={getStatusColor(payment.status)}
              variant="outlined"
              size="medium"
            />
            {payment.status === "pending" && (
              <Box ml={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="info"
                  disabled={role !== "member"}
                  onClick={() => handleMockPay(payment.id)}
                  sx={{
                    borderRadius: "15px",
                }}
                >
                  Pay
                </Button>
              </Box>
            )}
            </Box>
        </CardContent>
      </Card>
      <Box
            className="details-panel"
            sx={{
              width: 'calc(100vw - 60%)',
              backgroundColor: "background.paper",
              borderLeft: "1px solid #ddd",
              borderRadius: "3px 10px 10px 3px",
              padding: 2,
              transform: "translateX(-100%)",
              transition: "transform 0.8s ease, opacity 0.3s ease",
              opacity: 0,
              visibility: "hidden",
            }}
          >
          <Box sx={{display: 'flex', flexDirection: 'row', gap: 5}}>
            <Box sx={{display: 'flex', flexDirection: 'column', width:400}}>
                <Typography variant="body1" mt={1}>
                  This payment was made on <strong>{dayjs(payment.created_at).format("MMMM D, YYYY")}</strong>
                </Typography>
                  <Typography variant="body1" mt={1}>
                  It was <strong>{payment.description || "unspecified purpose"}</strong>.
                </Typography>
              </Box>
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
          {payment.status === "paid" && (
            <Typography variant="body1" mt={1} color="success.main">
              ✅ The payment has been successfully completed. No further action is required.
            </Typography>
          )}

          {payment.status === "pending" && (
            <Typography variant="body1" mt={1} color="warning.main">
              ⏳ This payment is still pending. Please make sure to complete it to confirm your reservation or service.
            </Typography>
          )}

          {payment.status === "failed" && (
            <Typography variant="body1" mt={1} color="error.main">
              ❌ The payment attempt failed. Please try again or use a different payment method.
            </Typography>
          )}

          {payment.status === "refunded" && (
            <Typography variant="body1" mt={1} color="text.secondary">
              💸 This payment has been refunded. If you have not received the refund, please contact support.
            </Typography>
          )}
              </Box>
            </Box>
        </Box>
            </Box>
          </Grid>
        ))}
        </Grid>
      )}

      {role !== "member" && (
        <EditPaymentDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handlePatchSubmit}
        currentStatus={selectedPayment?.status || ""}
        currentDescription={selectedPayment?.description || ""}
        />
      )}
    </Box>
  );
}
