// src/repo/api.ts (or a new types file, e.g., src/types/banner.ts)
export interface Banner {
    _id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    youtubeUrl: string;
    active: boolean;
    __v: number;
  }