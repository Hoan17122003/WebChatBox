import { Body, Controller, Get, Query } from '@nestjs/common';
import { LangchainService } from './LangchainService.service';
import { Neo4jService } from './Neo4jService.service';

@Controller('question')
export class AskController {
  constructor(
    private readonly langChainService: LangchainService,
    private readonly neo4jService: Neo4jService,
  ) {}

  @Get('')
  public async Answer(
    @Query('q') question: string,
    @Query('label') label: string,
  ) {
    console.log('question ', question);
    const responseCypher = this.langChainService.processQuery(question, label);
    return responseCypher;
  }
}
