import { CourseData } from "../pages/courses/course-add";
interface OrderUser {
  _id: string;
  email: string;
  username: string;
  mobileNumber?: string;
}

interface OrderStudent {
  _id: string;
  fullName: string;
  college?: string;
  studentType: string;
}

interface OrderBatch {
  _id: string;
  batchCode: string;
  startDate: Date;
}

interface Order {
  _id: string;
  totalAmount: number;
  amountPaid: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: OrderUser;
  student?: OrderStudent;
  batch: OrderBatch;
}

interface GetOrdersResponse {
  orders: Order[];
  total: number;
}

interface GetOrdersParams {
  skip?: number;
  limit?: number;
  search?: string;
  sortByDate?: "asc" | "desc";
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getOrders(params: GetOrdersParams = {}): Promise<GetOrdersResponse> {
    const queryParams = new URLSearchParams();

    if (params.skip !== undefined) {
      queryParams.append("skip", params.skip.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.sortByDate) {
      queryParams.append("sortByDate", params.sortByDate);
    }

    const response = await fetch(
      `${this.baseUrl}/orders?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new ApiClient("https://api.upskillab.com");
