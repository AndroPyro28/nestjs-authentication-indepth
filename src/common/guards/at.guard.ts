import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

export class AtGuard extends AuthGuard(['jwt_access_token']) {
    /**
     *
     */
    constructor(private reflector: Reflector) {
        super();
    }
    
    canActivate(context: ExecutionContext): boolean  {
        
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ])
        return isPublic ?? super.canActivate(context)
    }
}