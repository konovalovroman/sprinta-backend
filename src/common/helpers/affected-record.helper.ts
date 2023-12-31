import { DeleteResult, UpdateResult } from 'typeorm';

export const hasRecordAffected = (result: UpdateResult | DeleteResult): boolean => {
    return result.affected > 0;
};
