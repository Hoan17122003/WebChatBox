import { IsEmail, IsString, Matches, Max, Min } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  @Min(1, {
    message: 'độ dài tối thiểu là 1',
  })
  @Max(30, {
    message: 'độ dài tối đa là 100 ',
  })
  username: string;
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, {
    message:
      'độ dài tối thiểu là 8 kí tự, có tối thiểu là 1 kí tự hoa, 1 kí tự đặc biệt',
  })
  password: string;
  @IsEmail(
    {},
    {
      message: 'bạn phải nhập đúng định dạng email',
    },
  )
  email: string;
  @IsString()
  @Min(1, {
    message: 'độ dài tối thiểu là 1',
  })
  @Max(30, {
    message: 'độ dài tối đa là 30 ',
  })
  fullname: string;
}
