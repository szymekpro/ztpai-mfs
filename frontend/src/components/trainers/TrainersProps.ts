export interface TrainerCardProps {
    id: number;
    first_name: string;
    last_name: string;
    bio: string;
    description: string;
    photo: string;
    onDelete?: (id: number) => void;
}

export interface Trainer extends TrainerCardProps {
    id: number;
    gym_id: number;
}
