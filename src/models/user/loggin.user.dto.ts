import { IsOptional, IsString, ValidateNested, IsUUID, IsEmail } from 'class-validator';


export default class LoginUserDto{

    @IsString()
    public password: string;
  
    @IsEmail()
    public email: string;

    constructor(){}

}