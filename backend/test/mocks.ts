
jest.mock("encore.dev", () => ({
    Service: jest.fn(() => ({
      onStart: jest.fn(),
    })),
    api: jest.fn((options, handler) => handler),
  }));
  