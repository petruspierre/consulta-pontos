import { db } from "../db/connection.js";

export class SourceDAO {
  async findAll() {
    const data = await db('source').select({
      id: 'id',
      name: 'name',
      url: 'url'
    })

    return data;
  }
}