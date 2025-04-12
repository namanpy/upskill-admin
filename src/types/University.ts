export interface University {
    _id: string;
    createdAt: string;
    updatedAt: string;
    institutionType: string;
    deliveryMode: string;
    programType: string[]; // Array of program types
    ratings: number;
    reviews: number;
    certification: boolean;
    imageUrl: string;
    __v: number;
  }