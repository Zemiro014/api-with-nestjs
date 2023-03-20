import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    
    @ApiProperty()
    public first_name: string;

    @ApiProperty()
    public last_name: string;

    @ApiProperty()
    public avatar: string;
}