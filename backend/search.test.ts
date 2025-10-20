
import { indexUser, searchUsers } from "./search";
import { ProfileResponse } from "./auth/profile";

// Mock the Typesense client
jest.mock("typesense", () => {
  const mClient = {
    collections: jest.fn().mockReturnThis(),
    documents: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({}),
    search: jest.fn().mockResolvedValue({ hits: [] }),
    create: jest.fn().mockResolvedValue({}),
    retrieve: jest.fn().mockResolvedValue([]),
  };
  return {
    Client: jest.fn(() => mClient),
  };
});

// Mock the getProfile function
jest.mock("./auth/profile", () => ({
  getProfile: jest.fn((userId: string) => Promise.resolve({
    id: userId,
    firstName: "Test",
    lastName: "User",
    bio: "This is a test user.",
    interests: ["testing"],
    city: "Test City",
  })),
}));

describe("Search Service", () => {
  describe("indexUser", () => {
    it("should index a user in Typesense", async () => {
      const user: ProfileResponse = {
        id: "1",
        firstName: "Test",
        lastName: "User",
        bio: "This is a test user.",
        interests: ["testing"],
        city: "Test City",
      };

      await indexUser(user);

      // Verify that the Typesense client's upsert method was called with the correct data
      const typesense = new (require("typesense").Client)();
      expect(typesense.collections("users").documents().upsert).toHaveBeenCalledWith({
        id: "1",
        firstName: "Test",
        lastName: "User",
        bio: "This is a test user.",
        interests: ["testing"],
        city: "Test City",
      });
    });
  });

  describe("searchUsers", () => {
    it("should search for users with the given query", async () => {
      const typesense = new (require("typesense").Client)();
      (typesense.collections("users").documents().search as jest.Mock).mockResolvedValueOnce({
        hits: [{ document: { id: "1" } }],
      });

      const response = await searchUsers({ query: "test" });

      expect(response.hits.length).toBe(1);
      expect(response.hits[0].id).toBe("1");
    });

    it("should filter users by interests", async () => {
        const typesense = new (require("typesense").Client)();
        (typesense.collections("users").documents().search as jest.Mock).mockResolvedValueOnce({
          hits: [{ document: { id: "1" } }],
        });
  
        const response = await searchUsers({ query: "test", interests: ["music"] });
  
        expect(response.hits.length).toBe(1);
        expect(response.hits[0].id).toBe("1");
        expect(typesense.collections("users").documents().search).toHaveBeenCalledWith(expect.objectContaining({
          "filter_by": "interests:=[music]",
        }));
      });
  
      it("should filter users by city", async () => {
        const typesense = new (require("typesense").Client)();
        (typesense.collections("users").documents().search as jest.Mock).mockResolvedValueOnce({
          hits: [{ document: { id: "1" } }],
        });
  
        const response = await searchUsers({ query: "test", city: "Test City" });
  
        expect(response.hits.length).toBe(1);
        expect(response.hits[0].id).toBe("1");
        expect(typesense.collections("users").documents().search).toHaveBeenCalledWith(expect.objectContaining({
          "filter_by": "city:Test City",
        }));
      });
  });
});
