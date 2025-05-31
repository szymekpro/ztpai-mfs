export interface Payment {
    id: number;
    amount: number;
    status: "paid" | "pending" | "failed" | "refunded";
    description: string;
    created_at: string;
}
