export interface Blog {
    _id: string;
    createdAt: string;
    updatedAt: string;
    image: string;
    tag: string;
    title: string;
    description: string;
    studentId: string;
    approvedByAdmin: boolean;
    __v: number;
    studentName?: string; // Optional, added in GET response
  }