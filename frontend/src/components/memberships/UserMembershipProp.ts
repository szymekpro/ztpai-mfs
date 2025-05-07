interface UserMembership {
    id: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    membership_type: {
        id: number;
        name: string;
        description: string;
        duration_days: number;
        price: string;
        photo: string;
    };
}