export interface Story {
    _id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    jobTitle: string;
    userImageUrl: string;
    description: string;
    companyLogoUrl: string;
    role: string;
    companyName: string;
    before: string;
    after: string;
    skills: string[];
    duration: string;
    batch_Year: string;
    salaryIncrease: string;
    wallOfFame: boolean;
    __v: number;
  }