import { Request } from 'express';

export interface RequestWithUserRoles extends Request {
    currentUserRoles: Array<string>;
}
