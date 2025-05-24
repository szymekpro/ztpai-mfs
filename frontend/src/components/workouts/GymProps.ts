export interface Gym{
    id: number;
    name: string;
    city: string;
    address: string;
    photo_path: string;
}

export interface Trainer {
    id: number;
    first_name: string;
    last_name: string;
    gym: Gym;
    bio: string;
    photo_path: string;
}

export interface FormValues {
    trainer: string;
    gym: string;
    status: string;
    description: string;
    service_type: string;
}

export interface TrainerServices {
    id: number;
    name: string;
    description: string;
    price: number;
}

export interface TrainingHistoryProps {
    id: number;
    service_type: TrainerServices
    trainer: Trainer
    start_time: string;
    end_time: string;
    status: string;
    description: string;
}
