import { Request, Response } from 'express';
import { aiAgentEngine } from '../services/aiAgent';

export const processAIQuery = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid text query string is required.' });
    }

    const response = await aiAgentEngine.processUserMessage(query);

    res.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
