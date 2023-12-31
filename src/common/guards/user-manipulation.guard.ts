import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class UserManipulationGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest() as Request;
        const { id } = request.params;
        const { sub } = request.user;
        return sub === Number(id);
    }
}
