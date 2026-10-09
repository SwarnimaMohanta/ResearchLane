
import axios from "axios";

import type {
  AuthResponse,
  CurrentUser,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

import type {
  DashboardStats,
  RecentActivity,
  RecentPaper,
} from "@/types/dashboard";

import type {
  Paper,
  PaperSummary,
  PaperComparison,
} from "@/types/paper";

import type {
  ChatHistoryItem,
  ChatResponse,
} from "@/types/chat";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000",

  headers: {
    "Content-Type": "application/json",
  },
});


/* =========================
   AUTH
========================= */

export async function registerUser(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      data
    );

  return response.data;
}


export async function loginUser(
  data: LoginRequest
): Promise<AuthResponse> {
  const response =
    await api.post<AuthResponse>(
      "/auth/login",
      data
    );

  return response.data;
}


export async function googleLogin(
  credential: string
): Promise<AuthResponse> {
  const response =
    await api.post<AuthResponse>(
      "/auth/google",
      {
        credential,
      }
    );

  return response.data;
}


export async function getCurrentUser(
  token: string
): Promise<CurrentUser> {
  const response =
    await api.get<CurrentUser>(
      "/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


/* =========================
   DASHBOARD
========================= */

export async function getDashboardStats(
  token: string
): Promise<DashboardStats> {
  const response =
    await api.get<DashboardStats>(
      "/dashboard/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


export async function getRecentPapers(
  token: string
): Promise<RecentPaper[]> {
  const response =
    await api.get<RecentPaper[]>(
      "/dashboard/recent-papers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


export async function getRecentActivity(
  token: string
): Promise<RecentActivity[]> {
  const response =
    await api.get<RecentActivity[]>(
      "/dashboard/recent-activity",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


export async function clearRecentActivity(
  token: string
): Promise<void> {
  await api.delete(
    "/dashboard/recent-activity",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}


/* =========================
   PAPERS
========================= */

export async function getPapers(
  token: string
): Promise<Paper[]> {
  const response =
    await api.get<Paper[]>(
      "/papers/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


/*
 * Get the complete PDF file for a paper.
 */

export async function getPaperPdf(
  token: string,
  paperId: number
): Promise<Blob> {
  const response =
    await api.get<Blob>(
      `/papers/${paperId}/file`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        responseType: "blob",
      }
    );

  return response.data;
}


/*
 * Get one exact PDF page as an image.
 */

export async function getPaperPage(
  token: string,
  paperId: number,
  pageNumber: number
): Promise<Blob> {
  const response =
    await api.get<Blob>(
      `/papers/${paperId}/page/${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        responseType: "blob",
      }
    );

  return response.data;
}


export async function uploadPaper(
  token: string,
  file: File,
  title?: string,
  description?: string
): Promise<Paper> {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  if (title) {
    formData.append(
      "title",
      title
    );
  }

  if (description) {
    formData.append(
      "description",
      description
    );
  }

  const response =
    await api.post<Paper>(
      "/papers/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
}


export async function deletePaper(
  token: string,
  paperId: number
): Promise<void> {
  await api.delete(
    `/papers/${paperId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}


/*
 * Generate AI summary for a research paper.
 */

export async function generatePaperSummary(
  token: string,
  paperId: number
): Promise<PaperSummary> {
  const response =
    await api.post<PaperSummary>(
      `/papers/${paperId}/summary`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


/*
 * Compare two research papers.
 */

export async function comparePapers(
  token: string,
  paperAId: number,
  paperBId: number
): Promise<PaperComparison> {
  const response =
    await api.post<PaperComparison>(
      "/papers/compare",
      {
        paper_a_id: paperAId,
        paper_b_id: paperBId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


/* =========================
   AI CHAT
========================= */

export async function sendChatMessage(
  token: string,
  question: string,
  paperId?: number | null
): Promise<ChatResponse> {
  const response =
    await api.post<ChatResponse>(
      "/chat/",
      {
        question,
        paper_id:
          paperId ?? null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


export async function getChatHistory(
  token: string
): Promise<ChatHistoryItem[]> {
  const response =
    await api.get<ChatHistoryItem[]>(
      "/chat/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}


export default api;

