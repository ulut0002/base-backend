import { Request, Response } from "express";
import { getPublicUserProfile, updateUser } from "../services";

/**
 * @route   GET /user/profile
 * @desc    Fetch the current user's profile information.
 * @access  Protected
 */
const profile = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "User profile data placeholder" });
};

/**
 * @route   PATCH /user/email
 * @desc    Update the current user's email address.
 * @access  Protected
 */
const updateEmail = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Email update placeholder" });
};

/**
 * @route   PATCH /user/username
 * @desc    Update the current user's username.
 * @access  Protected
 */
const updateUsername = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Username update placeholder" });
};

/**
 * @route   POST /user/deactivate
 * @desc    Deactivate the current user's account.
 * @access  Protected
 */
const deactivateAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({ message: "Account deactivation placeholder" });
};

/**
 * @route   POST /user/reactivate
 * @desc    Reactivate a previously deactivated user account.
 * @access  Protected
 */
const reactivateAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({ message: "Account reactivation placeholder" });
};

/**
 * @route   DELETE /user
 * @desc    Delete current account permanently.
 * @access  Protected
 */
const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Account deletion placeholder" });
};

const patchUpdateAccount = async (req: Request, res: Response) => {
  const updated = await updateUser(req.params.id, req.body);
  res.json(updated);
};

const fetchPublicProfile = async (req: Request, res: Response) => {
  const profile = await getPublicUserProfile(req.params.username);
  if (!profile) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(profile);
};

export {
  profile,
  updateEmail,
  updateUsername,
  deactivateAccount,
  reactivateAccount,
  deleteAccount,
  patchUpdateAccount,
  fetchPublicProfile,
};
