import { CourseData } from "../pages/courses/course-add";

interface LoginRequest {
  identifier: string;
  password: string;
}

interface LoginResponse {
  authToken: string;
}

interface Category {
  name: string;
  _id: string;
  categoryName: string;
  categoryCode: string;
  categoryImage: string;
  categoryDescription: string;
  featured: boolean;
  active: boolean;
}

interface CategoryResponse {
  data: Category[];
  count: number;
}

interface CategoryQueryParams {
  searchString?: string;
  featured?: boolean;
  skip?: number;
  limit?: number;
}

interface UpdateCategoryRequest {
  categoryName: string;
  categoryCode: string;
  categoryLogo: string;
  categoryImage: string;
  categoryDescription: string;
  featured: boolean;
  active: boolean;
}

interface UpdateCategoryResponse {
  isSuccess: boolean;
}

interface FaqDto {
  question: string;
  answer: string;
}

interface TopicDto {
  _id?: string;
  topicName: string;
  active: boolean;
}

interface ChapterDto {
  _id?: string;
  name: string;
  chapterNumber: number;
  week: number;
  session: number;
  topics: TopicDto[];
  active: boolean;
}

interface AddCategoryRequest {
  categoryName: string;
  categoryCode: string;
  categoryImage: string;
  categoryLogo: string;
  categoryDescription: string;
  featured: boolean;
  active?: boolean;
}

interface AddCategoryResponse {
  isSuccess: boolean;
}

interface AddCourseRequest {
  courseName: string;
  category: string;
  categoryName: string;
  courseCode: string;
  courseImage: string;
  courseMode: string;
  courseDuration: number;
  originalPrice: number;
  discountedPrice: number;
  youtubeUrl: string | null;
  brochure: string;
  certificate: string;
  active: boolean;
  chapters: ChapterDto[];
  faqs: FaqDto[];
  shortDescription: string;
  tags: string[];
  programDetails: string;
  targetAudience: string[];
}

interface AddCourseResponse {
  isSuccess: boolean;
}

interface GetCourseByCodeRequestDto {
  courseCode: string;
}

interface GetCourseByCodeResponseDto {
  _id: string;
  courseName: string;
  category: string;
  categoryName: string;
  courseCode: string;
  courseImage: string;
  courseMode: string;
  courseDuration: number;
  originalPrice: number;
  discountedPrice: number;
  youtubeUrl: string | null;
  brochure: string;
  certificate: string;
  active: boolean;
  chapters: ChapterDto[];
  faqs: FaqDto[];
  courseLevel: {
    code: string;
    name: string;
  };
  language: {
    _id: string;
    languageCode: string;
    languageName: string;
  };
  shortDescription: string;
  tags: string[];
  programDetails: string;
  targetAudience: string[];
}

interface UpdateCourseRequestDto {
  courseId: string;
  courseName?: string;
  category?: string;
  categoryName?: string;
  courseCode?: string;
  courseImage?: string;
  courseMode?: string;
  courseDuration?: number;
  originalPrice?: number;
  discountedPrice?: number;
  youtubeUrl?: string | null;
  brochure?: string;
  courseLevel: string;
  language: string;
  certificate?: string;
  active?: boolean;
  chapters?: ChapterDto[];
  faqs?: FaqDto[];
  shortDescription: string;
  tags: string[];
  programDetails: string;
  targetAudience: string[];
}

interface UpdateCourseResponseDto {
  isSuccess: boolean;
}

interface SortOption {
  field: string;
  order: "asc" | "desc";
}

interface GetCourseDisplayRequest {
  skip?: number;
  limit?: number;
  sort?: SortOption[];
  categoryIds?: string[];
  search?: string;
}

export interface CourseDisplay {
  _id: string;
  courseName: string;
  category: Category;
  courseCode: string;
  courseImage: string;
  courseMode: string;
  courseDuration: number;
  originalPrice: number;
  discountedPrice: number;
  youtubeUrl?: any;
  brochure: string;
  certificate: string;
  active: boolean;
  seatsAvailable: number;
  courseRating: number;
}

interface GetCourseDisplayResponse {
  data: CourseDisplay[];
  count: number;
}

interface GetCategoryByCodeRequestDto {
  categoryCode: string;
}

interface GetCategoryByCodeResponseDto {
  _id: string;
  categoryName: string;
  categoryCode: string;
  categoryImage: string;
  categoryLogo: string;
  categoryDescription: string;
  featured: boolean;
  active: boolean;
}

interface Language {
  _id: string;
  languageCode: string;
  languageName: string;
}

interface LanguageResponse {
  data: Language[];
  count: number;
}

interface LanguageQueryParams {
  search?: string;
  skip?: number;
  limit?: number;
}

interface FileResponse {
  files: {
    filename: string;
    fileId: string;
    fileUrl: string;
  }[];
}

export interface Teacher {
  _id: string;
  user: string;
  name: string;
  qualification: string;
  expertise: string;
  social_links: Record<string, any>;
  bio: string;
  experience: string;
  createdAt: string;
  updatedAt: string;
}

interface Batch {
  _id: string;
  course: CourseData;
  batchCode: string;
  startTime: number;
  startDate: string;
  totalSeats: number;
  remainingSeats: number;
  duration: string;
  teacher: Teacher;
  imageUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BatchesResponse {
  batches: Batch[];
}

interface TeacherQueryParams {
  search?: string;
  skip?: number;
  limit?: number;
}

interface TeachersResponse {
  teachers: Teacher[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    return response.json();
  }

  async addCategory(
    categoryData: AddCategoryRequest
  ): Promise<AddCategoryResponse> {
    const response = await fetch(`${this.baseUrl}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add category: ${response.statusText}`);
    }

    return response.json();
  }

  async updateCategory(
    categoryId: string,
    categoryData: UpdateCategoryRequest
  ): Promise<UpdateCategoryResponse> {
    const response = await fetch(`${this.baseUrl}/category/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Category not found");
      }
      if (response.status === 409) {
        throw new Error("Category already exists");
      }
      throw new Error(`Failed to update category: ${response.statusText}`);
    }

    return response.json();
  }

  async getCategories(
    params: CategoryQueryParams = {}
  ): Promise<CategoryResponse> {
    const queryParams = new URLSearchParams();

    if (params.searchString)
      queryParams.append("searchString", params.searchString);
    if (params.featured !== undefined)
      queryParams.append("featured", params.featured.toString());
    if (params.skip !== undefined)
      queryParams.append("skip", params.skip.toString());
    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${this.baseUrl}/category?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  async addCourse(courseData: AddCourseRequest): Promise<AddCourseResponse> {
    const response = await fetch(`${this.baseUrl}/course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      console.error("Response error:", await response.json());
      throw new Error(`Failed to add course: ${await response.text()}`);
    }

    return response.json();
  }

  async getCourseByCode(
    input: GetCourseByCodeRequestDto
  ): Promise<GetCourseByCodeResponseDto> {
    const response = await fetch(
      `${this.baseUrl}/course/code/${input.courseCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }

    return response.json();
  }

  async updateCourse(
    courseData: UpdateCourseRequestDto
  ): Promise<UpdateCourseResponseDto> {
    const { courseId, ...courseDataWithoutId } = courseData;
    const response = await fetch(
      `${this.baseUrl}/course/${courseData.courseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseDataWithoutId),
      }
    );

    console.log("Response:", await response.json());
    if (!response.ok) {
      throw new Error(`Failed to update course: ${response.statusText}`);
    }

    return response.json();
  }

  async getCourseDisplay(
    params: GetCourseDisplayRequest
  ): Promise<GetCourseDisplayResponse> {
    console.log("Params:", JSON.stringify(params));
    const response = await fetch(`${this.baseUrl}/course/display`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch course display: ${response.statusText}`);
    }

    return response.json();
  }

  async getCategoryByCode(
    input: GetCategoryByCodeRequestDto
  ): Promise<GetCategoryByCodeResponseDto> {
    const response = await fetch(
      `${this.baseUrl}/category/code/${input.categoryCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Category not found");
      }
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    return response.json();
  }

  async getLanguages(
    params: LanguageQueryParams = {}
  ): Promise<LanguageResponse> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.skip !== undefined)
      queryParams.append("skip", params.skip.toString());
    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${this.baseUrl}/languages?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch languages: ${response.statusText}`);
    }

    return response.json();
  }

  // Add this method to ApiClient class
  async uploadFiles(
    files: File[],
    {
      attachment,
      attachmentName,
    }: { attachment?: boolean; attachmentName?: string } = {}
  ): Promise<FileResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const queryParams = new URLSearchParams();
    if (attachment !== undefined) {
      queryParams.append("attachment", attachment.toString());
    }
    if (attachmentName) {
      queryParams.append("attachmentName", attachmentName);
    }

    const url = `${this.baseUrl}/file${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload files: ${response.statusText}`);
    }

    return response.json();
  }

  async getBatches(): Promise<BatchesResponse> {
    const response = await fetch(`${this.baseUrl}/batches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch batches: ${response.statusText}`);
    }

    return response.json();
  }

  async getTeachers(
    params: TeacherQueryParams = {}
  ): Promise<TeachersResponse> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.skip !== undefined)
      queryParams.append("skip", params.skip.toString());
    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${this.baseUrl}/teachers?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch teachers: ${response.statusText}`);
    }

    return response.json();
  }

  async createBatch(
    batchData: {
      course: string;
      batchCode: string;
      startDate: string;
      startTime: string;
      totalSeats: number;
      remainingSeats: number;
      duration: string;
      teacher: string;
      active: boolean;
    },
    imageFile?: File
  ): Promise<{ isSuccess: boolean }> {
    const formData = new FormData();

    // Append each batch data field individually to FormData
    formData.append("course", batchData.course);
    formData.append("batchCode", batchData.batchCode);
    formData.append("startDate", batchData.startDate);
    formData.append("startTime", batchData.startTime);
    formData.append("totalSeats", batchData.totalSeats.toString());
    formData.append("remainingSeats", batchData.remainingSeats.toString());
    formData.append("duration", batchData.duration);
    formData.append("teacher", batchData.teacher);
    formData.append("active", batchData.active.toString());

    // Append image if provided
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${this.baseUrl}/batches`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create batch: ${errorData}`);
    }

    return response.json();
  }

  async getBatchById(id: string): Promise<{ batch: Batch }> {
    const response = await fetch(`${this.baseUrl}/batches/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Batch not found");
      }
      throw new Error(`Failed to fetch batch: ${response.statusText}`);
    }

    return response.json();
  }

  async updateBatch(
    id: string,
    batchData: Partial<{
      course: string;
      batchCode: string;
      startDate: string;
      startTime: string;
      totalSeats: number;
      remainingSeats: number;
      duration: string;
      teacher: string;
      active: boolean;
      imageUrl: string; // Add imageUrl parameter
    }>
  ): Promise<{ isSuccess: boolean }> {
    const response = await fetch(`${this.baseUrl}/batches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update batch: ${errorData}`);
    }

    return response.json();
  }
}

export default new ApiClient("https://api.upskillab.com");
