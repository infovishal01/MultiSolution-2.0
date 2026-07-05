import { api } from "./api";
import type { Worker } from "../types";

export const getWorkers = async (filters?: {
  service?: string;
  city?: string;
}): Promise<Worker[]> => {
  const res = await api.get<{ success: true; workers: Worker[] }>(
    "/workers",
    { params: filters }
  );
  return res.data.workers;
};

export const registerAsWorker = async (data: {
  services: string[];
  experienceYears?: number;
  bio?: string;
  city: string;
}): Promise<Worker> => {
  const res = await api.post<{ success: true; worker: Worker }>(
    "/workers",
    data
  );
  return res.data.worker;
};

export const getMyWorkerProfile = async (): Promise<Worker> => {
  const res = await api.get<{ success: true; worker: Worker }>(
    "/workers/me/profile"
  );
  return res.data.worker;
};
