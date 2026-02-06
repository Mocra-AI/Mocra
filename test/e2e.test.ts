import { VideoObservabilityApi } from "../src/video-observability-api.ts";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import * as dotenv from "dotenv";

use(chaiAsPromised);

describe("VideoObservabilityApi", () => {
  let API_KEY: string;
  const INVALID_API_KEY = "definitely invalid api key";

  before(() => {
    dotenv.config();

    const candidateApiKey = process.env["MOCRA_API_KEY"];
    if (candidateApiKey) {
      API_KEY = candidateApiKey;
    } else {
      throw new Error("No API key to run E2E tests with.");
    }
  });

  describe("constructor", () => {
    it("should accept an API key without checking its validity", () => {
      expect(() => {
        new VideoObservabilityApi(INVALID_API_KEY);
      }).to.not.throw();
    });
  });

  describe("scoreVideo", () => {
    const bigBuckBunnyVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
    const defaultCriteriaArray: (
      | "UNNATURAL PHYSICS"
      | "MORPHING"
      | "FLICKERING"
      | "ARTIFACTING"
      | "TEXT ISSUES"
    )[] = [
      "UNNATURAL PHYSICS",
      "MORPHING",
      "FLICKERING",
      "ARTIFACTING",
      "TEXT ISSUES",
    ];
    const defaultScoresArray = defaultCriteriaArray;

    it("should reject an invalid API key", async () => {
      const api = new VideoObservabilityApi(INVALID_API_KEY);
      expect(
        (async () => {
          await api.scoreVideo("http://example.com");
        })(),
      ).to.eventually.be.rejectedWith();
    });

    it("should score low-res Big Buck Bunny video low with default params", async () => {
      const api = new VideoObservabilityApi(API_KEY);
      const result = await api.scoreVideo(bigBuckBunnyVideoUrl);
      console.log({ bigBuckBunnyResult: JSON.stringify(result) });
      expect(result.severity).to.be.at.least(0).and.at.most(80);
      expect(result.criteria.map((c) => c.name)).to.containSubset(
        defaultScoresArray,
      );
      expect(defaultScoresArray).to.containSubset(
        result.criteria.map((c) => c.name),
      );
    });

    it("should score low-res Big Buck Bunny video high with only res param", async () => {
      const api = new VideoObservabilityApi(API_KEY);
      const result = await api.scoreVideo(
        bigBuckBunnyVideoUrl,
        [
          {
            criterionName: "Resolution",
            criterionDescription:
              "Resolution, so that it does not look blurry.",
          },
        ],
        defaultCriteriaArray,
      );
      console.log({ bigBuckBunnyResult: JSON.stringify(result) });
      expect(result.severity).to.be.at.least(60).and.at.most(100);
      expect(result.criteria.map((c) => c.name)).to.containSubset([
        "Resolution",
      ]);
      expect(["Resolution"]).to.containSubset(
        result.criteria.map((c) => c.name),
      );
    });
  });
});
