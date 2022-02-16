import { Response, NextFunction } from 'express';

export default (roleCode: string) => (req: any, res: Response, next: NextFunction) => {
  req.roleCode = roleCode;
  next();
};
