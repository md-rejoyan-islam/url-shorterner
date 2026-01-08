import { UserRole } from "../modules/user/user.type";

export declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}
