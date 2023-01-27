export interface JwtPayloadWithUserRoles {
    exp: number;
    iat: number;
    userRoles: string[];
}
