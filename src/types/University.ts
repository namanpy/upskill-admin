// export interface University {
//   _id: string;
//   createdAt: string;
//   updatedAt: string;
//   institutionType: string;
//   deliveryMode: string;
//   programType: string; // Single string
//   programs: string[]; // Array of programs
//   rating: number; // Singular as per response
//   reviews: number;
//   certification: boolean;
//   imageUrl: string;
//   __v: number;
// }

// src/repo/api.ts (update the University interface)
export interface University {
  _id: string;
  createdAt: string;
  updatedAt: string;
  institutionType: string;
  deliveryMode: string;
  programType: string; // Optional, as it’s missing in some responses
  programs: string[]; // Array of programs
  rating: number; // Singular as per latest response
  reviews: number;
  certification: boolean;
  imageUrl: string;
  __v: number;
  fitCropUrl?: string; // Optional, appears in some responses
}