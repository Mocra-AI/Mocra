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

const MOCRA_API_DOMAIN = "api.mocra.io";

class VideoObservabilityApi {
  private apiKey: string;

  public constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async scoreVideo(
    videoUrl: string,
    extraCriteria: Array<ExtraCriterion> = [],
    ignoreCriteria: Array<DefaultCriterionName> = [],
  ): Promise<Record<string, number>> {
    if (extraCriteria.length === 0 && ignoreCriteria.length === 0) {
      const response = await fetch(`https://${MOCRA_API_DOMAIN}/observe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl,
        }),
      });
      if (response.ok) {
        return (await response.json()) as Record<string, number>;
      } else {
        throw new Error(
          `Mocra returned unsuccessfully with error ${response.status}`,
        );
      }
    } else {
      const response = await fetch(
        `https://${MOCRA_API_DOMAIN}/customObserve`,
        {
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
        },
      );
      if (response.ok) {
        return (await response.json()) as Record<string, number>;
      } else {
        throw new Error(
          `Mocra returned unsuccessfully with error ${response.status}`,
        );
      }
    }
  }
}
