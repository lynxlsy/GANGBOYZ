import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Define the content storage path
const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(CONTENT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read content from file
const readContent = () => {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error reading content file:', error);
    return {};
  }
};

// Write content to file
const writeContent = (content: any) => {
  try {
    ensureDataDir();
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing content file:', error);
    return false;
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  switch (req.method) {
    case 'GET':
      try {
        const content = readContent();
        
        // If specific ID is requested, return only that content
        const { id } = req.query;
        if (id && typeof id === 'string') {
          res.status(200).json({ [id]: content[id] || null });
        } else {
          // Return all content
          res.status(200).json(content);
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to read content' });
      }
      break;

    case 'POST':
      try {
        const { id, content } = req.body;
        
        if (!id || content === undefined) {
          res.status(400).json({ error: 'ID and content are required' });
          return;
        }

        const existingContent = readContent();
        existingContent[id] = content;
        
        if (writeContent(existingContent)) {
          res.status(200).json({ success: true, id });
        } else {
          res.status(500).json({ error: 'Failed to save content' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to save content' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}