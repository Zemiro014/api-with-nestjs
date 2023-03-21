import { ApiProperty } from "@nestjs/swagger";

export class CreateImageUserDto {
    @ApiProperty({required: true})
    userId: string;

    @ApiProperty()
    userImageBase64: string;
}