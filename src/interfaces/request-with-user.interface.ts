import { Request } from 'express';

import { UsersEntity } from 'src/users/users.entity';

export interface RequestWithUser extends Request {
    currentUser: UsersEntity | null;
}
