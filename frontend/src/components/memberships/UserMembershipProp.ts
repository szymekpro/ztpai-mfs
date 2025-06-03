import {User} from "../user/UserProps.ts"

export interface UserMembership {
    id: number;
    user: User;
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

export interface MembershipTypeProps {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_days: number;
  photo: string;
}