import { Request } from 'express';

export interface RequestWithUserRole extends Request {
    currentUserRole: string | undefined | null;
}
