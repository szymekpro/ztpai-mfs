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

export interface Gym {
  id: number;
  name: string;
  city: string;
}

export interface TrainerService {
  id: number;
  name: string;
  description: string;
}

export interface Trainer extends TrainerCardProps {
  gym_id: number;
  available_services: number[];
}
