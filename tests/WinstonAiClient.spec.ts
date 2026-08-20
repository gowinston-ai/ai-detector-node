import { AdvancedAiImageDetectionResponse, AiImageDetectionResponse, AiTextDetectionResponse, FactCheckResponse, PlagiarismResponse, TextCompareResponse } from "../src/type";
import { WinstonAIClient } from "../src/WinstonAIClient";

require('dotenv').config();

jest.setTimeout(60_000);

const WINSTON_AI_API_KEY = process.env.WINSTON_AI_API_KEY ? process.env.WINSTON_AI_API_KEY : null;
const A_INVALID_TEXT = "This is an invalid text";
const A_RANDOM_VALID_AI_GENERATED_TEXT = "SpaceX was founded in 2002 with the goal of making spaceflight cheaper and more reliable, and over two decades it has become one of the most influential aerospace companies in the world. Its Falcon 9 rocket is reused regularly, landing on droneships and concrete pads after sending satellites, cargo, and crews into orbit. Dragon capsules fly astronauts to the International Space Station, while Starlink has grown into a global satellite internet constellation serving ships, aircraft, remote communities, and emergency responders. At the same time, Starship is being developed as a fully reusable heavy-lift vehicle intended for missions to Earth orbit, the Moon, and eventually Mars. The company tests aggressively, iterates quickly, and treats failed flights as data rather than dead ends. That culture has compressed development timelines that once stretched across decades. Whether launching rideshare payloads, recovering boosters, or building larger vehicles in Texas, SpaceX has shifted the industry toward rapid reuse, higher launch cadence, and a more commercial path into space. The long-term bet remains simple: if the cost of access falls far enough, exploration, science, and industry beyond Earth become practical rather than exceptional."
const ANOTHER_RANDOM_VALID_AI_GENERATED_TEXT = "SpaceX’s main effort right now is Starship, the fully reusable Super Heavy booster and Starship upper stage being stacked, flown, and iterated at Starbase in Texas. The company is trying to prove rapid reuse at a much larger scale than Falcon 9: catch the booster, fly often, and drive down the cost of putting mass into orbit. That vehicle is also the core of NASA’s Artemis human landing system, so lunar missions sit on the same development path as commercial cargo and, later, crewed flights. In parallel, Falcon 9 remains the workhorse. It is still flying Starlink batches, NASA and commercial crew Dragon missions, and rideshare payloads, with boosters landing on droneships and pads as a routine part of the business. Starlink itself is the other current project that actually prints money: thousands of satellites in low Earth orbit, serving homes, ships, aircraft, and remote users, while newer generations add capacity and direct-to-cell features. SpaceX is also building toward higher launch cadence from Florida and California, expanding production of vehicles and satellites, and treating each test as a chance to change hardware fast. The long-range pitch has not changed. If Starship becomes reliable and cheap enough, the same architecture that fills Starlink and serves NASA is supposed to carry cargo, then people, toward the Moon and eventually Mars. For now the work is more practical than cinematic: fly, land, inspect, rebuild, and fly again.";
const UNSUPPORTED_LANGUAGE = "XYZ";

const AN_INVALID_IMAGE_URL = "https://XYZ.com";
const A_VALID_AI_GENERATED_IMAGE = "https://www.artofprint.co.za/cdn-cgi/image/dpr=1,fit=contain,format=auto,width=1200,height=1000/image/catalog/big_images/final.png";

// if api key is null, skip the tests
if (!WINSTON_AI_API_KEY) {
  describe('WinstonAiClient', () => {
    test('skip tests because api key is not set', () => {
      expect(true).toBe(true);
    });
  });
} else {

  describe('WinstonAiClient', () => {

    let client: WinstonAIClient;

    beforeEach(() => {
      client = new WinstonAIClient(WINSTON_AI_API_KEY);
    });

    describe('given the method detectText', () => {

      describe('when the method is called with an invalid text', () => {
        test('then verify the function call throws an WinstonBadRequestError', () => {
          expect(client.detectText({ text: A_INVALID_TEXT })
          ).rejects.toThrow("The text must be at least 300 characters.");
        });
      });

      describe('when the method is called with an unsupported language', () => {

        test('then verify the function call throws an WinstonBadRequestError', () => {
          expect(client.detectText({ text: A_RANDOM_VALID_AI_GENERATED_TEXT, language: UNSUPPORTED_LANGUAGE })
          ).rejects.toThrow("Language 'XYZ' not supported.");
        });
      });

      describe('when the method is called with a valid text', () => {

        let response: AiTextDetectionResponse;

        beforeEach(async () => {
          response = await client.detectText({ text: A_RANDOM_VALID_AI_GENERATED_TEXT });
        });

        test('then verify the response is valid and the scan was successful', () => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          expect(response.input).toBe("text");
          expect(response.language).toBe("en");
          expect(response.score).toBe(0);
          expect(response.credits_used).toBe(186);
        });

        test('then verify the response contains sentences', () => {
          expect(response.sentences).toBeDefined();
          expect(response.sentences.length).toBe(8)
        });
      });
    });

    describe('given the method detectImage', () => {

      describe('when the method is called with an invalid image url', () => {
        test('then verify the function call throws an WinstonBadRequestError', () => {
          expect(client.detectImage({ url: AN_INVALID_IMAGE_URL })
          ).rejects.toThrow("Failed to validate image");
        });
      });

      describe('when the method is called with a valid image url', () => {

        let response: AiImageDetectionResponse;

        beforeEach(async () => {
          response = await client.detectImage({ url: A_VALID_AI_GENERATED_IMAGE });
        });

        test('then verify the response is valid and the scan was successful', () => {
          expect(response).toBeDefined();
          expect(response.score).toBe(0);
          expect(response.ai_probability).toBe(1);
          expect(response.credits_used).toBe(300);
        });

      });

    });

    describe('given the method detectAdvancedImage', () => {
      describe('when the method is called with a valid image url', () => {
        let response: AdvancedAiImageDetectionResponse;
        beforeEach(async () => {
          response = await client.detectAdvancedImage({ image_url: A_VALID_AI_GENERATED_IMAGE });
        });
        test('then verify the response is valid and the scan was successful', () => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          expect(response.cost).toBe(500);
        });
      });


    });

    describe('given the method checkPlagiarism', () => {
      describe('when the method is called with an invalid text', () => {
        test('then verify the function call throws an WinstonBadRequestError', () => {
          expect(client.checkPlagiarism({ text: A_INVALID_TEXT })
          ).rejects.toThrow("Bad Request");
        });
      });

      describe('when the method is called with a valid text', () => {
        let response: PlagiarismResponse;
        beforeEach(async () => {
          response = await client.checkPlagiarism({ text: A_RANDOM_VALID_AI_GENERATED_TEXT });
        });
        test('then verify the response is valid and the scan was successful', () => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          expect(response.result.score).toBe(0); // 0 since it's AI-generated text
        });
      });

    });

    describe('given the method checkFact', () => {
      describe('when the method is called with an invalid text', () => {
        test('then verify the function call throws an WinstonBadRequestError', () => {
          expect(client.checkFact({ text: A_INVALID_TEXT })
          ).rejects.toThrow();
        });
      });

      describe('when the method is called with a valid text', () => {
        let response: FactCheckResponse;

        beforeEach(async () => {
          response = await client.checkFact({ text: A_RANDOM_VALID_AI_GENERATED_TEXT });
        });

        test('then verify the response is valid and the scan was successful', () => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
        });
      });
    });

    describe('given the method compareText', () => {
      describe('when the method is called with 2 valid texts', () => {

        let response: TextCompareResponse;

        beforeEach(async () => {
          response = await client.compareText({ first_text: A_RANDOM_VALID_AI_GENERATED_TEXT, second_text: ANOTHER_RANDOM_VALID_AI_GENERATED_TEXT });
        });

        test('then verify the response is valid and the comparison was successful', () => {
          expect(response).toBeDefined();
          expect(response.status).toBe(200);
          expect(response.similarity_score).toBeGreaterThan(70);
          expect(response.first_text).toBeDefined();
          expect(response.second_text).toBeDefined();
        });
      });
    });

  });

}

