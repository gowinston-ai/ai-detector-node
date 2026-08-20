import { AiImageDetectionResponse, AiTextDetectionResponse } from "../src/type";
import { WinstonAIClient } from "../src/WinstonAIClient";

require('dotenv').config();

const A_INVALID_TEXT = "This is an invalid text";
const UNSUPPORTED_LANGUAGE = "XYZ";
const A_RANDOM_TEXT = "SpaceX was founded in 2002 with the goal of making spaceflight cheaper and more reliable, and over two decades it has become one of the most influential aerospace companies in the world. Its Falcon 9 rocket is reused regularly, landing on droneships and concrete pads after sending satellites, cargo, and crews into orbit. Dragon capsules fly astronauts to the International Space Station, while Starlink has grown into a global satellite internet constellation serving ships, aircraft, remote communities, and emergency responders. At the same time, Starship is being developed as a fully reusable heavy-lift vehicle intended for missions to Earth orbit, the Moon, and eventually Mars. The company tests aggressively, iterates quickly, and treats failed flights as data rather than dead ends. That culture has compressed development timelines that once stretched across decades. Whether launching rideshare payloads, recovering boosters, or building larger vehicles in Texas, SpaceX has shifted the industry toward rapid reuse, higher launch cadence, and a more commercial path into space. The long-term bet remains simple: if the cost of access falls far enough, exploration, science, and industry beyond Earth become practical rather than exceptional."
const WINSTON_AI_API_KEY = process.env.WINSTON_AI_API_KEY ? process.env.WINSTON_AI_API_KEY : null;

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
          expect(client.detectText({ text: A_RANDOM_TEXT, language: UNSUPPORTED_LANGUAGE })
          ).rejects.toThrow("Language 'XYZ' not supported.");
        });
      });

      describe('when the method is called with a valid text', () => {

        let response: AiTextDetectionResponse;

        beforeEach(async () => {
          response = await client.detectText({ text: A_RANDOM_TEXT });
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
      test('verify client exists', () => {
        expect(client).toBeDefined();
      });
    });

    describe('given the method checkPlagiarism', () => {
      test('verify client exists', () => {
        expect(client).toBeDefined();
      });
    });

    describe('given the method checkFact', () => {
      test('verify client exists', () => {
        expect(client).toBeDefined();
      });
    });

    describe('given the method compareText', () => {
      test('verify client exists', () => {
        expect(client).toBeDefined();
      });
    });

  });

}

