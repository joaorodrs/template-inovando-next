import { ApiPagination } from "./api";

export type ProfileData = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  status: boolean;
};

export type ProfileResponse = {
  data: ProfileData[];
  pagination: ApiPagination;
};
