interface LoginRequest {
  identifier: string;
  password: string;
}

interface LoginResponse {
  authToken: string;
}

interface Category {
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
  certificate?: string;
  active?: boolean;
  chapters?: ChapterDto[];
  faqs?: FaqDto[];
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

interface CourseDisplay {
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
    console.log("Params:", JSON.stringify(params)); // Add this line to log the params object
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
}

export default new ApiClient("https://shark-app-ixo3s.ondigitalocean.app");
