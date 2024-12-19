import { Module } from '@nestjs/common';
import { PdfService } from './PdfService.service';
import { LangchainService } from './LangchainService.service';
import { Neo4jService } from './Neo4jService.service';
import { AskController } from './AskController.controller';

@Module({
  controllers: [AskController],
  providers: [PdfService, LangchainService, Neo4jService],
  exports: [PdfService, LangchainService, Neo4jService],
})
export class ScriptModule {}
