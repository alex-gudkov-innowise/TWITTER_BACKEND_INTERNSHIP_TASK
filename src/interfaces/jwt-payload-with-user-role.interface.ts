export interface JwtPayloadWithUserRole {
    exp: number;
    iat: number;
    userRole: string;
}
