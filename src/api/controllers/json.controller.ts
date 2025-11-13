import { Request, Response, NextFunction } from 'express';
import { parseInstagramJson, extractUsernames } from '../../services/jsonParser';

export const parseJson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jsonContent } = req.body;

    if (!jsonContent) {
      return res.status(400).json({ error: 'JSON content is required' });
    }

    // Parse and extract usernames
    const data = parseInstagramJson(JSON.stringify(jsonContent));
    const usernames = extractUsernames(data);

    res.json({
      success: true,
      count: usernames.length,
      usernames,
    });
  } catch (error: any) {
    next(error);
  }
};
