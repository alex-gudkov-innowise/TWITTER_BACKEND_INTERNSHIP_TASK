import { PrivacyInfo } from './privacy-info.interface';

export interface SessionEntity {
    id: string;
    loggedAt: Date;
    privacyInfo: PrivacyInfo;
}
