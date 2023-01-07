import { UsersEntity } from 'src/users/users.entity';

export interface RequestWithUser extends Request {
    currentUser: UsersEntity | null;
    headers: HeadersWithUser;
}

interface HeadersWithUser extends Headers {
    authorization: string | undefined;
}
