import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator((data: string | undefined, executionContext: ExecutionContext) => {
    const request = executionContext.switchToHttp().getRequest()
    if(data) {
        return request.user[data];
    }
    return request.user;
})