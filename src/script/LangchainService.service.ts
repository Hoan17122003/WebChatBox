import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Sử dụng Google Gemini AI
import { PromptTemplate } from '@langchain/core/prompts';
import { HumanMessage } from '@langchain/core/messages';
import { GoogleGenerativeAIResponseError } from '@google/generative-ai';
import { Neo4jService } from './Neo4jService.service';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class LangchainService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor(private readonly neo4jService: Neo4jService) {
    // Load API key từ biến môi trường
    console.log(`API Key: ${process.env.GOOGLE_API_KEY}`);
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // Chú ý sử dụng đúng tên mô hình
    });
  }

  /**
   * Phân tích nội dung và trả về kết quả dưới dạng JSON.
   * @param text Nội dung cần phân tích.
   */
  public async anaLysis(text: string): Promise<any> {
    try {
      // Khởi tạo mô hình Gemini 1.5-Flash

      // Template cho câu hỏi (prompt)
      const template = `Phân tích nội dung dưới đây thành các nhãn và quan hệ và hãy làm rõ trong mỗi phần như file csv,
      hãy chỉ trả về dữ liệu lưu ý chỉ trả cùng 1 file
      
      . Nội dung: {content}`;
      const promptTemplate = new PromptTemplate({
        template,
        inputVariables: ['content'],
      });

      // Format template để tạo câu hỏi cuối cùng
      const prompt = await promptTemplate.format({ content: text });

      // Gửi yêu cầu đến mô hình
      const response = await this.model.generateContent([prompt]);
      console.log('response : ', response.response.text().trim());
      return response.response
        .text()
        .replace('```csv', '')
        .replace('```', '')
        .trim();
    } catch (error) {
      console.error('Error during analysis:', error);
      throw error;
    }
  }

  public async generateCypherQuery(
    content: string,
    label: string,
  ): Promise<string> {
    const properties = await this.neo4jService.fetchPropertiesForLabel(label);

    const template =
      //  ` Bạn là một trợ lý AI thông minh. Dựa trên thông tin cung cấp, hãy trả lời câu hỏi của người dùng.

      // Dữ liệu đầu vào:
      // - Label: {label}
      // - Properties: {properties}

      // Câu hỏi của người dùng: "{question}"

      // Yêu cầu:
      // 1. Phân tích dữ liệu từ "Properties" và tìm thông tin phù hợp nhất liên quan đến câu hỏi.
      // 2. Cung cấp câu trả lời ngắn gọn, chính xác dựa trên dữ liệu.
      // 3. Nếu không tìm thấy thông tin trong dữ liệu, trả lời rằng không có thông tin phù hợp.
      // 4. chỉ trả về duy nhất câu truy vấn
      // Câu hỏi của người dùng: "{question}"
      // `;

      'bạn hãy tạo truy vấn dựa trên câu hỏi và hãy chỉ trả về câu truy vấn: {question} để truy vấn vào neo4j, label: {label} và theo Properties: {properties}';
    // 'You are a Cypher query generator for Neo4j.The current label is {label} and it has the following properties: {properties}. Use only these properties to create queries.';
    const promptTemplate = new PromptTemplate({
      template,
      inputVariables: ['question', 'properties', 'label', 'Related'],
    });
    const prompt = await promptTemplate.format({
      question: content,
      properties: properties.keys,
      label,
      Related: properties.related,
    });
    // const cypherChain = RunnableSequence.from([prompt, this.model]);
    // const response = await this.model.generateContent({
    //   contents: [{ role: 'user', parts: [{ text: prompt }] }],
    //   generationConfig: { temperature: 0.7 },
    // });
    // const generateCypher = await cypherChain.invoke({ content, label });
    const response = await this.model.generateContent(prompt);

    console.log(`resposne : ${response.response.text().trim()} `);
    const cypher = response.response
      .text()
      .trim()
      .replace('```cypher', '')
      .replace('```', '')
      .trim();
    console.log(`cypher : ${cypher}`);

    const result = (await this.neo4jService.runCypher(cypher)).toString();
    return result;
    // return response.response.text().trim();
    // return generateCypher.content;
  }
  // Phương thức kết hợp Gemini với Neo4j để trả về kết quả
  async processQuery(question: string, label: string) {
    // Sử dụng Gemini để tạo câu truy vấn Cypher
    const cypherQuery = await this.generateCypherQuery(question, label);
    console.log('Generated Cypher Query:', cypherQuery);

    // Gọi Neo4j để thực thi câu truy vấn Cypher
    const result = await this.neo4jService.runCypher(cypherQuery);
    return result.map((record) => record.toObject()); // Trả về kết quả từ Neo4j
  }

  private isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
}
