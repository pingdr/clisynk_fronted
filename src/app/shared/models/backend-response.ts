export interface BackendResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}


export interface PaginatedResponse<T> {
    data: T;
    count: number;
}
  