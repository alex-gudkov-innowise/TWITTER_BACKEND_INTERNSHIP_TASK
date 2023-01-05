// DTO (Data Transfer Object) — design pattern for data transforming between the application subsystems
export class CreateUserDto {
    readonly email: string;
    readonly password: string;
}
