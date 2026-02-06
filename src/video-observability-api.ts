import { z } from "zod";

interface ExtraCriterion {
  criterionName: string;
  criterionDescription: string;
}

type DefaultCriterionName =
  | "UNNATURAL PHYSICS"
  | "MORPHING"
  | "FLICKERING"
  | "ARTIFACTING"
  | "TEXT ISSUES";

const ScoreMapSchema = z.object({
  severity: z.number(),
  criteria: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
    }),
  ),
});

type ScoreMap = z.infer<typeof ScoreMapSchema>;

const MOCRA_API_DOMAIN = "https://api.mocra.io";

class VideoObservabilityApi {
  private apiKey: string;

  public constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async scoreVideo(
    videoUrl: string,
    extraCriteria: Array<ExtraCriterion> = [],
    ignoreCriteria: Array<DefaultCriterionName> = [],
  ): Promise<ScoreMap> {
    const response = await fetch(`${MOCRA_API_DOMAIN}/observe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoUrl,
        customCriteria: extraCriteria,
        removeCriteria: ignoreCriteria,
      }),
    });
    if (response.ok) {
      return ScoreMapSchema.parse(await response.json());
    } else {
      throw new Error(
        `Mocra returned unsuccessfully with error ${response.status}`,
      );
    }
  }
}

export { VideoObservabilityApi };
