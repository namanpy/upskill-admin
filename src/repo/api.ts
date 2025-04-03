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
  chapters: {
    name: string;
    chapterNumber: number;
    week: number;
    session: number;
    topics: {
      topicName: string;
      active: boolean;
    }[];
    active: boolean;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

interface AddCourseResponse {
  isSuccess: boolean;
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
      throw new Error(`Failed to add course: await response.text()`);
    }

    return response.json();
  }
}

export default new ApiClient("https://shark-app-ixo3s.ondigitalocean.app");
