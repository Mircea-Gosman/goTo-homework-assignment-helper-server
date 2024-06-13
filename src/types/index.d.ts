import { User } from "../interfaces/User";

declare global {
  declare namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

// to make the file a module and avoid the TypeScript error
export {}