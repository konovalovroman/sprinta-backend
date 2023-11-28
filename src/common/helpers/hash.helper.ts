import { genSalt, compare, hash } from 'bcrypt';

export const hashString = async (str: string): Promise<string> => {
    const salt = await genSalt(10);
    const hashedString = await hash(str, salt);
    return hashedString;
};

export const compareHashAndString = async (hash: string, str: string): Promise<boolean> => {
    const isEqual = await compare(str, hash);
    return isEqual;
};
