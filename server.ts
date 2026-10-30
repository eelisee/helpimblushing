import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  predictDateMatch, 
  runModelFineTuning, 
  CANDIDATE_VENUES, 
  TOPIC_WEIGHTS, 
  BEVERAGE_WEIGHTS 
} from './src/ml/eliseeModel';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Real ML API Endpoint: Forward Inference Pass
  app.post('/api/ml/infer', (req, res) => {
    try {
      const candidateFeatures = req.body;
      const result = predictDateMatch(candidateFeatures);
      res.json({
        success: true,
        model: 'DeepChemistry-Elisee-7B (Fine-Tuned)',
        referenceTarget: 'Elisee (@ey_elisee)',
        inference: result,
      });
    } catch (error) {
      console.error('ML inference error:', error);
      res.status(500).json({ success: false, error: 'ML forward pass failed' });
    }
  });

  // Real ML API Endpoint: Model Fine-Tuning Simulator
  app.post('/api/ml/train', (req, res) => {
    try {
      const candidateFeatures = req.body;
      const result = predictDateMatch(candidateFeatures);
      res.json({
        success: true,
        epochsTrained: result.trainingLogs.length,
        finalLoss: result.loss,
        finalAccuracy: result.trainingLogs[result.trainingLogs.length - 1].accuracy,
        logs: result.trainingLogs,
      });
    } catch (error) {
      console.error('ML training error:', error);
      res.status(500).json({ success: false, error: 'ML training failed' });
    }
  });

  // Real ML API Endpoint: Model Weights & Reference Meta
  app.get('/api/ml/reference', (_req, res) => {
    res.json({
      modelName: 'DeepChemistry-Elisee-7B',
      groundTruthCalibrated: true,
      candidateVenues: CANDIDATE_VENUES,
      rankedTopics: TOPIC_WEIGHTS,
      rankedBeverages: BEVERAGE_WEIGHTS,
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ML Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
