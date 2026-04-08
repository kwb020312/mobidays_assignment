import { API_BASE_URL } from "@/shared/constants";

// 커스텀 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  let response: Response;

  // 네트워크 에러 처리
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    });
  } catch (error) {
    // 네트워크 오류 (offline, DNS 실패, CORS 등)
    if (error instanceof TypeError) {
      if (!navigator.onLine) {
        throw new NetworkError(
          "네트워크에 연결되어 있지 않습니다. 인터넷 연결을 확인해주세요."
        );
      }
      throw new NetworkError(
        "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    }
    throw error;
  }

  // HTTP 에러 처리
  if (!response.ok) {
    const statusMessages: Record<number, string> = {
      400: "잘못된 요청입니다.",
      401: "인증이 필요합니다.",
      403: "접근 권한이 없습니다.",
      404: "요청한 리소스를 찾을 수 없습니다.",
      500: "서버 오류가 발생했습니다.",
      502: "서버가 일시적으로 사용 불가능합니다.",
      503: "서비스가 일시적으로 사용 불가능합니다.",
    };

    const message =
      statusMessages[response.status] ??
      `요청 실패 (${response.status} ${response.statusText})`;

    throw new ApiError(message, response.status);
  }

  // JSON 파싱 에러 처리
  try {
    return await response.json();
  } catch {
    throw new ApiError(
      "서버 응답을 처리할 수 없습니다.",
      response.status,
      "PARSE_ERROR"
    );
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
