// import { Ability, AbilityBuilder, AbilityClass, InferSubjects } from '@casl/ability';
// import { Injectable } from '@nestjs/common';

// import { UsersEntity } from 'src/users/entities/users.entity';

// export type Subjects = InferSubjects<typeof UsersEntity | 'read'>;

// export type AppAbility = Ability<[Actions, Subjects]>;

// @Injectable()
// export class AbilityFactory {
//     public defineAbility(user: UsersEntity) {
//         const { build, can, cannot } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

//         return build();
//     }
// }
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { UsersEntity } from 'src/users/entities/users.entity';

export enum Actions {
    create = 'create',
    delete = 'delete',
    manage = 'manage',
    read = 'read',
    update = 'update',
}

@Injectable()
export class AbilityFactory {
    public defineAbility(user: UsersEntity) {
        const { build, can, cannot } = new AbilityBuilder(createMongoAbility);

        cannot(Actions.read, 'user-tweet');

        return build();
    }
}
