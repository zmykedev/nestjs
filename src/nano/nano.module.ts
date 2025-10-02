import { Module } from '@nestjs/common';
import { NanoController } from './nano.controller';
import { NanoService } from './nano.service';

@Module({
  controllers: [NanoController],
  providers: [NanoService],
  exports: [NanoService],
})
export class NanoModule {}
