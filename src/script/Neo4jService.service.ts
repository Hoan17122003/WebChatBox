import { Injectable } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';
import * as readline from 'readline';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class Neo4jService {
  private driver: neo4j.Driver;
  private session: neo4j.Session;
  constructor() {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USERNAME;
    const password = process.env.NEO4J_PASSWORD;
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    this.session = this.driver.session({ database: 'ChatBox' });
  }

  public parseLabels(text: string): any[] {
    const labels = [];
    const regex = /Label Name: (.*?), Description: (.*?)(?=\n|$)/g;
    let match;

    // Tìm tất cả các nhãn trong văn bản trả về
    while ((match = regex.exec(text)) !== null) {
      const label = match[1].trim();
      const description = match[2].trim();
      labels.push({ name: label, description });
    }

    return labels;
  }
  async saveToNeo4j(originalFile: string, filename: string) {
    try {
      // Thêm dữ liệu vào Neo4j
      const r1 = readline.createInterface({
        input: fs.createReadStream(originalFile),
        output: process.stdout,
        terminal: false,
      });
      const nodes = {};
      const relationships = {};

      fs.createReadStream(originalFile)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            for (const [key, value] of Object.entries(row)) {
              if (!nodes[key]) {
                nodes[key] = new Set();
              }
              nodes[key].add(value);
            }
          } catch (error) {}
        });
      // await this.session.run(
      //   `CREATE (${filename}:concept {name : content: $content}) RETURN n`,
      //   {
      //     content: data,
      //   },
      // );
      return 'lưu thành công';
    } finally {
    }
  }
  // Hàm thực hiện truy vấn Cypher
  async runCypher(query: string ) {
    const session = this.driver.session({ database: 'ChatBox' });
    try {
      const result = await session.run(query);
      return result.records; // Trả về kết quả truy vấn
    } catch (error) {
      console.error('Error running Cypher query', error);
      throw error;
    }
  }
  // Hàm tự động xác định các node và relationship từ CSV
  async importCsvToNeo4j(filePath: string, absoluteFile: string) {
    const headers = []; // Lưu tiêu đề cột từ CSV
    const rows = []; // Lưu các dòng dữ liệu từ CSV
    const relationships = []; // Lưu các relationships

    // Đọc tệp CSV và phân tích dữ liệu
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headerList) => {
        headers.push(...headerList); // Lưu tiêu đề cột
      })
      .on('data', (row) => {
        rows.push(row); // Lưu từng dòng dữ liệu
      })
      .on('end', async () => {
        console.log('Đã xử lý xong dữ liệu CSV.');

        // Tạo các node
        await this.createNodes(headers, rows, absoluteFile);
        // Tạo relationships (nếu có)
        await this.createRelationships(headers, rows);

        // await this.session.close(); // Đóng session sau khi xử lý
        // await this.driver.close(); // Đóng kết nối với Neo4j
      });
  }

  // Hàm tạo các nodes
  async createNodes(headers, rows, absoluteFile: string) {
    for (const row of rows) {
      // Duyệt qua từng dòng và tạo node cho mỗi cột (mỗi thuộc tính)
      const nodeProperties = {};

      for (const header of headers) {
        // Nếu cột có giá trị, thì tạo thuộc tính cho node
        if (row[header]) {
          nodeProperties[header] = row[header];
        }
      }

      // Tạo một label duy nhất cho node dựa trên tên cột (hoặc tên trường)
      const label = absoluteFile.toLowerCase(); // Tên label có thể được thay đổi nếu cần (hoặc lấy từ một cột nào đó)

      const query = `
      MERGE (n:${label} {name: $name})
      SET n += $properties
    `;

      await this.session.run(query, {
        name: row[headers[0]], // Giả sử cột đầu tiên là identifier cho node
        properties: nodeProperties,
      });

      console.log(
        `Đã tạo node với các thuộc tính: ${JSON.stringify(nodeProperties)}`,
      );
    }
  }

  // Hàm lấy properties từ label cụ thể
  async fetchPropertiesForLabel(
    label: string,
  ): Promise<{ keys: string[]; related: string[] }> {
    try {
      const schemaTemplate = `MATCH (n:${label})-[r]->(m)
WITH n, r, keys(n) AS propertyKeys, type(r) AS relationshipType
UNWIND propertyKeys AS key
RETURN DISTINCT key, relationshipType`;
      // `MATCH (n:${label})
      //                         WITH n, keys(n) AS propertyKeys
      //                         UNWIND propertyKeys AS key
      //                         RETURN DISTINCT key`;
      const result = await this.session.run(schemaTemplate); // Neo4j format requires ":" before label
      const keys = result.records.map(
        (record) => '`' + record.get('key') + '`',
      );
      keys.forEach((element) => {
        console.log(`key : ${keys}`);
      });
      const relateds = result.records.map(
        (record) => '`' + record.get('relationshipType') + '`',
      );

      return {
        keys,
        related: relateds,
      };
    } finally {
    }
  }

  // Hàm tạo relationships (nếu có)
  async createRelationships(headers, rows) {
    for (const row of rows) {
      for (const header of headers) {
        // Tìm kiếm các cột có thể chứa quan hệ
        if (row[header] && header !== 'name') {
          // Kiểm tra cột có giá trị và không phải là identifier
          const from = row[headers[0]]; // Giả sử cột đầu tiên là identifier cho node
          const to = row[header]; // Các giá trị trong các cột còn lại có thể là đối tượng liên quan

          const query = `
          MATCH (a {name: $from}), (b {name: $to})
          MERGE (a)-[:RELATED_TO]->(b)
        `;

          await this.session.run(query, { from, to });

          console.log(`Đã tạo relationship từ ${from} đến ${to}`);
        }
      }
    }
  }
}
