import { SetMetadata } from '@nestjs/common';

export interface AbilityToCheck {
    action: string;
    subject: string;
}

export const METADATA_KEY_CHECK_ABILITY = 'CHECK_ABILITY';

export const CheckAbilityDecorator = function (abilityToCheck: AbilityToCheck) {
    return SetMetadata(METADATA_KEY_CHECK_ABILITY, abilityToCheck);
};
