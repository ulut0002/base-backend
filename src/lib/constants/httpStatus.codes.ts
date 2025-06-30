import { StatusCodes } from "http-status-codes";

export const HTTP_STATUS = {
  OK: StatusCodes.OK,
  CREATED: StatusCodes.CREATED,
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,
  FORBIDDEN: StatusCodes.FORBIDDEN,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  CONFLICT: StatusCodes.CONFLICT,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  // Add more as needed
};
