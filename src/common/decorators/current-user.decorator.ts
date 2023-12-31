import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        return data ? user[data] : user;
    },
);
