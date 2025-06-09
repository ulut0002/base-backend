// --- controllers/user.controller.ts ---

import { Request, Response } from "express";
import {
  deleteUser,
  findUserById,
  getPublicUserProfile,
  getUsers,
  updateUser,
} from "../services";

export const fetchUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, sortBy, sortOrder } = req.query;

  const result = await getUsers({
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    search: search as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  });

  res.json(result);
};

export const fetchUserById = async (req: Request, res: Response) => {
  const user = await findUserById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
};
