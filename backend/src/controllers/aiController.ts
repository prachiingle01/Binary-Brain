import { Request, Response } from 'express';
import { executeAgentQuery } from '../services/aiAgent';

export async function processAIQuery(req: Request, res: Response) {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required for AI agent processing.' });
    }

    const result = await executeAgentQuery(query, context);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
