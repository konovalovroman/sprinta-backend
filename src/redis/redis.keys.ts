export const authRefreshTokenKey = (userId: number): string => {
    return `auth:refreshToken#${userId}`;
};
