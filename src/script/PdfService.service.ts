import { Injectable } from '@nestjs/common';
import { Driver } from 'neo4j-driver';
import * as neo4j from 'neo4j-driver';
import * as pdfParse from 'pdf-parse';
// import { LLMChain, PromptTemplate, OpenAI } from 'langchain';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChainInput, LLMChain } from 'langchain/chains';
import { OpenAI } from '@langchain/openai';
import { Neo4jService } from './Neo4jService.service';
import { LangchainService } from './LangchainService.service';
// import { Document } from '@langchain/core/documents';
import { Express } from 'express';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';

@Injectable()
export class PdfService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly langchainService: LangchainService,
  ) {}

  public async extractTextFormPDF(pdfBuffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(pdfBuffer);
      return data.text;
    } catch (error) {
      throw Error(error);
    }
  }

  public async processPdf(file: Express.Multer.File) {
    const pdfText = await this.extractTextFormPDF(file.buffer);
    console.log(`pdftext : ${pdfText}`);
    const fileNameAbsolute = `${file.originalname.split('.')[0]}_${Date.now()}`;
    const pathFile = `uploads/${fileNameAbsolute}.csv`;
    const response = await this.langchainService.anaLysis(pdfText);
    if (!fs.existsSync(pathFile)) {
      fs.writeFileSync(pathFile, response);
    }

    const label = await this.neo4jService.importCsvToNeo4j(
      pathFile,
      fileNameAbsolute,
    );

    // const text = this.neo4jService.subString(response);
    return response;
  }
}
