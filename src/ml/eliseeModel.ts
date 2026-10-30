/**
 * ============================================================================
 * ELISEE NEURAL DATING MODEL (Ground Truth Calibrated)
 * ============================================================================
 * Ranked Preferences:
 * 1. Topics (Multi-Select):
 *    - Tech Philosophy (+0.38)
 *    - Asking Absurd Questions About Your Life (+0.35)
 *    - Books & Literature Talk (+0.31)
 *    - Teasing / Banter (+0.28)
 * 2. Beverages (Ranked):
 *    - Good Wine (+0.39)
 *    - Espresso Martini (+0.36)
 *    - Craft Coffee (+0.32)
 *    - Draft Beer (+0.26)
 * 3. Locations:
 *    - Jupiter (Berkeley)
 *    - Comal (Berkeley)
 *    - Grizzly Peak & UC Botanical Garden Walk (Berkeley)
 *    - Bakers & Commons / Gara (Berkeley)
 *    - Exploratorium After Dark (San Francisco)
 *    - Fort Mason Center for Arts & Culture (San Francisco)
 * 4. Custom Initiative (User's own proposed idea):
 *    - Overrides and outputs the highest match coefficient (+0.45)
 */

export interface CandidateFeatures {
  locationId: string;
  topics: string[];
  beverage: 'good_wine' | 'espresso_martini' | 'craft_coffee' | 'draft_beer';
  customProposal?: string;
}

export interface TrainingEpochLog {
  epoch: number;
  loss: number;
  accuracy: number;
  gradientNorm: number;
}

export interface FeatureAttribution {
  featureName: string;
  coefficient: number;
}

export interface InferenceResult {
  confidence: number;
  cosineSimilarity: number;
  loss: number;
  overfittingDetected: boolean;
  predictedVenue: VenueDetail;
  featureAttributions: FeatureAttribution[];
  trainingLogs: TrainingEpochLog[];
}

export interface VenueDetail {
  id: string;
  name: string;
  city: 'Berkeley' | 'San Francisco';
  neighborhood: string;
  tag: string;
}

export const CANDIDATE_VENUES: VenueDetail[] = [
  {
    id: 'jupiter-berkeley',
    name: 'Jupiter Beer & Courtyard',
    city: 'Berkeley',
    neighborhood: 'Downtown Berkeley',
    tag: 'Heated outdoor garden patio, craft ales, cozy vibes',
  },
  {
    id: 'comal-berkeley',
    name: 'Comal Fire-Pits',
    city: 'Berkeley',
    neighborhood: 'Downtown Arts District',
    tag: 'Back patio fire pits, craft mezcal & good wine',
  },
  {
    id: 'grizzly-botanical-walk',
    name: 'Grizzly Peak & UC Botanical Garden Walk',
    city: 'Berkeley',
    neighborhood: 'Berkeley Hills',
    tag: 'Redwood trails, panoramic sunset over the Golden Gate',
  },
  {
    id: 'bakers-and-commons',
    name: 'Bakers & Commons / Gara',
    city: 'Berkeley',
    neighborhood: 'Elmwood / College Ave',
    tag: 'Artisan espresso, relaxed sidewalk conversations',
  },
  {
    id: 'exploratorium-sf',
    name: 'Exploratorium After Dark',
    city: 'San Francisco',
    neighborhood: 'Pier 15 / Embarcadero',
    tag: 'Thursday night 18+ interactive science playground & drinks',
  },
  {
    id: 'fort-mason-center',
    name: 'Fort Mason Center for Arts & Culture',
    city: 'San Francisco',
    neighborhood: 'Marina / Fort Mason',
    tag: 'Arts center, waterfront exhibitions, festivals & gallery walks',
  },
];

export const TOPIC_WEIGHTS: Record<string, { label: string; weight: number }> = {
  tech_philosophy: { label: 'Tech Philosophy', weight: 0.38 },
  absurd_questions: { label: 'Asking Absurd Questions About Your Life', weight: 0.35 },
  books_literature: { label: 'Books & Literature Talk', weight: 0.31 },
  teasing: { label: 'Teasing & Witty Banter', weight: 0.28 },
};

export const BEVERAGE_WEIGHTS: Record<string, { label: string; weight: number }> = {
  good_wine: { label: 'Good Wine', weight: 0.39 },
  espresso_martini: { label: 'Espresso Martini', weight: 0.36 },
  craft_coffee: { label: 'Craft Coffee', weight: 0.32 },
  draft_beer: { label: 'Draft Beer', weight: 0.26 },
};

export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Computes Cosine Similarity between two arrays.
 */
export function computeCosineSimilarity(u: number[], v: number[]): number {
  let dot = 0;
  let normU = 0;
  let normV = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
    normU += u[i] * u[i];
    normV += v[i] * v[i];
  }
  const denom = Math.sqrt(normU) * Math.sqrt(normV);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Real Gradient Descent Simulator with Cross-Entropy Loss computation.
 */
export function runModelFineTuning(featureScores: number[]): TrainingEpochLog[] {
  const epochs = 16;
  const learningRate = 0.09;
  const logs: TrainingEpochLog[] = [];

  let weights = featureScores.map((s) => s + (Math.random() * 0.1 - 0.05));
  const target = 1.0;

  for (let epoch = 1; epoch <= epochs; epoch++) {
    let dot = 0.1;
    for (let i = 0; i < featureScores.length; i++) {
      dot += weights[i] * featureScores[i];
    }
    const pred = sigmoid(dot);
    const loss = -(target * Math.log(Math.max(pred, 1e-7)) + (1 - target) * Math.log(Math.max(1 - pred, 1e-7)));
    const error = pred - target;

    let gradSum = 0;
    for (let i = 0; i < weights.length; i++) {
      const grad = error * featureScores[i];
      gradSum += Math.abs(grad);
      weights[i] -= learningRate * grad;
    }

    logs.push({
      epoch,
      loss: parseFloat(loss.toFixed(4)),
      accuracy: parseFloat((Math.min(0.998, 0.74 + (epoch / epochs) * 0.258)).toFixed(3)),
      gradientNorm: parseFloat(gradSum.toFixed(4)),
    });
  }

  return logs;
}

/**
 * Forward pass prediction.
 */
export function predictDateMatch(features: CandidateFeatures): InferenceResult {
  const selectedVenue = CANDIDATE_VENUES.find((v) => v.id === features.locationId) || CANDIDATE_VENUES[0];

  // Calculate positive feature attributions based on user's choices
  const attributions: FeatureAttribution[] = [];

  // Custom User Proposal gets HIGHEST priority and score (+0.45)
  if (features.customProposal && features.customProposal.trim()) {
    attributions.push({
      featureName: `Custom Idea: "${features.customProposal.trim()}"`,
      coefficient: 0.45,
    });
  }

  // Beverage contribution
  const bevItem = BEVERAGE_WEIGHTS[features.beverage] || BEVERAGE_WEIGHTS.good_wine;
  attributions.push({
    featureName: `Beverage Calibration (${bevItem.label})`,
    coefficient: bevItem.weight,
  });

  // Topics contribution
  const activeTopics = features.topics && features.topics.length > 0 ? features.topics : ['tech_philosophy'];
  activeTopics.forEach((topicKey) => {
    const item = TOPIC_WEIGHTS[topicKey];
    if (item) {
      attributions.push({
        featureName: `Discussion: ${item.label}`,
        coefficient: item.weight,
      });
    }
  });

  // Venue contribution
  attributions.push({
    featureName: `Location Affinity (${selectedVenue.name})`,
    coefficient: 0.35,
  });

  // Sort attributions by coefficient descending so the highest match is always on top
  attributions.sort((a, b) => b.coefficient - a.coefficient);

  // Feature scores vector for ML training
  const featureScores = attributions.map((a) => a.coefficient);
  const trainingLogs = runModelFineTuning(featureScores);

  // Compute confidence (approaching 99.8%)
  const totalScore = featureScores.reduce((acc, v) => acc + v, 0);
  const logit = totalScore + 1.2;
  const confidence = parseFloat(Math.min(0.998, sigmoid(logit)).toFixed(3));
  const finalLoss = trainingLogs[trainingLogs.length - 1].loss;

  return {
    confidence,
    cosineSimilarity: 0.988,
    loss: finalLoss,
    overfittingDetected: true,
    predictedVenue: selectedVenue,
    featureAttributions: attributions,
    trainingLogs,
  };
}
