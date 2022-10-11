import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export class Email implements CanActivate {
    /**
     *
     */
    constructor(private reflector: Reflector) {
    }
    
    canActivate(context: ExecutionContext): boolean  {
        const authorizedEmail = this.reflector.get<string>('authorizedEmail', context.getHandler())
        if(!authorizedEmail && authorizedEmail === undefined) return true
        
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return authorizedEmail == user?.email
    }
}