import {SetMetadata} from "@nestjs/common"

export const Email = (authorizedEmail: string) => {
    return SetMetadata("authorizedEmail", authorizedEmail)
}