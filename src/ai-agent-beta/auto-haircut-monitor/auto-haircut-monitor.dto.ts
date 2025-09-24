// import { IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

// export class StartAutoHaircutMonitorDto {
//   @ApiProperty({
//     description: 'Интервал проверки колонки New в секундах',
//     example: 30,
//     minimum: 10,
//     required: false,
//   })
//   @IsOptional()
//   @IsNumber()
//   @Min(10)
//   checkIntervalSeconds?: number = 30;
// }

// export class UpdateMonitorSettingsDto {
//   @ApiProperty({
//     description: 'Включить/выключить мониторинг',
//     example: true,
//     required: false,
//   })
//   @IsOptional()
//   @IsBoolean()
//   enabled?: boolean;

//   @ApiProperty({
//     description: 'Интервал проверки в секундах',
//     example: 30,
//     minimum: 10,
//     required: false,
//   })
//   @IsOptional()
//   @IsNumber()
//   @Min(10)
//   checkIntervalSeconds?: number;
// }
