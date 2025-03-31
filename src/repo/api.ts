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
}

export default new ApiClient("https://shark-app-ixo3s.ondigitalocean.app");
