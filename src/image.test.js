import GetImage from "./functions/image.js";
import axios from "axios";

const mockPost = jest.spyOn(axios, "post");
const mockGetEnv = jest.fn();
global.Netlify = {
  env: {
    get: (key) => mockGetEnv(key),
  },
};
const request = new Request("", {
  method: "POST",
  body: JSON.stringify({ prompt: "string" }),
});

beforeEach(() => {
  mockGetEnv.mockReturnValue("API_KEY");
});

it("should return 200 OK", async () => {
  const res = await GetImage(request, undefined);
  expect(res.status).toBe(200);
});
it("should call openai api", async () => {
  await GetImage(request, context);
  expect(mockPost).toHaveBeenCalledWith(
    "https://api.openai.com/v1/images/generations",
    {
      model: "dall-e-2",
      prompt: "",
      n: 1,
      size: "256x256",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer API_KEY",
      },
    },
  );
});
it("should use API key from env variable", async () => {
  mockGetEnv.mockReturnValue("different_api_key");
  let spyAuthorization = "";
  mockPost.mockImplementation(({}, {}, options) => {
    spyAuthorization = options.headers.Authorization;
  });
  await GetImage(request, context);
  expect(mockGetEnv).toHaveBeenCalledWith("API_KEY");
  expect(spyAuthorization).toBe("Bearer different_api_key");
});

it("should call openai api using  requested prompt ", async () => {
  await GetImage(request, context);
  expect(mockPost).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      prompt: "string",
    }),
    expect.anything(),
  );
});
