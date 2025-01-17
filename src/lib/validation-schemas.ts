import { z } from 'zod';

const timelineSchema = z.string();
const importanceSchema = z.number().min(0).max(100);
const riskLevelSchema = z.number().min(0).max(100);

export const jobAnalysisSchema = z.object({
  overview: z.object({
    impactScore: z.number().min(10).max(100),
    summary: z.string(),
    timeframe: timelineSchema,
  }),
  responsibilities: z.object({
    current: z.array(z.object({
      task: z.string(),
      automationRisk: z.number().min(0).max(100),
      reasoning: z.string(),
      timeline: timelineSchema,
      humanValue: z.string(),
    })),
    emerging: z.array(z.object({
      task: z.string(),
      importance: importanceSchema,
      timeline: timelineSchema,
      reasoning: z.string().optional(),
    })),
  }),
  skills: z.object({
    current: z.array(z.object({
      skill: z.string(),
      currentRelevance: z.number().min(0).max(100),
      futureRelevance: z.number().min(0).max(100),
      automationRisk: z.number().min(0).max(100),
      reasoning: z.string(),
    })),
    recommended: z.array(z.object({
      skill: z.string(),
      importance: importanceSchema,
      timeline: timelineSchema,
      resources: z.array(z.string()),
    })),
  }),
  opportunities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    actionItems: z.array(z.string()),
    timeline: timelineSchema,
    potentialOutcome: z.string(),
  })),
  threats: z.array(z.object({
    title: z.string(),
    description: z.string(),
    riskLevel: riskLevelSchema,
    mitigationSteps: z.array(z.string()),
    timeline: timelineSchema,
  })),
  recommendations: z.object({
    immediate: z.array(z.string()),
    shortTerm: z.array(z.string()),
    longTerm: z.array(z.string()),
  }),
});
