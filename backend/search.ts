
import { Service } from "encore.dev/service";
import { api } from "encore.dev/api";
import { ProfileResponse, getProfile } from "./auth/profile";

// Base service
const service = new Service("search");

// Environment variables
const typesenseHost = process.env.TYPESENSE_HOST ?? "localhost";
const typesensePort = parseInt(process.env.TYPESENSE_PORT ?? "8108", 10);
const typesenseProtocol = process.env.TYPESENSE_PROTOCOL ?? "http";
const typesenseApiKey = process.env.TYPESENSE_API_KEY ?? "xyz";

// Typesense client
const typesense = new (require("typesense").Client)({
  nodes: [
    {
      host: typesenseHost,
      port: typesensePort,
      protocol: typesenseProtocol,
    },
  ],
  apiKey: typesenseApiKey,
});

const usersSchema = {
    name: "users",
    fields: [
      { name: "id", type: "string" },
      { name: "firstName", type: "string" },
      { name: "lastName", type: "string" },
      { name: "bio", type: "string", optional: true },
      { name: "interests", type: "string[]", facet: true, optional: true },
      { name: "city", type: "string", facet: true, optional: true },
    ],
    default_sorting_field: "id",
};

service.onStart(async () => {
    const collections = await typesense.collections().retrieve();
    const collectionNames = collections.map((c: any) => c.name);

    if (!collectionNames.includes("users")) {
        await typesense.collections().create(usersSchema);
    }
});


export const indexUser = api({ expose: true, method: 'POST', path: '/search/users' }, async (user: ProfileResponse): Promise<void> => {
    const document = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        interests: user.interests,
        city: user.city,
    };
    await typesense.collections("users").documents().upsert(document);
});


interface SearchUsersParams {
    query: string;
    interests?: string[];
    city?: string;
}

interface SearchUsersResponse {
    hits: ProfileResponse[];
}

export const searchUsers = api<SearchUsersParams, SearchUsersResponse>({ method: 'GET', path: '/search/users' }, async ({ query, interests, city }) => {
    const searchParameters: any = {
        'q': query,
        'query_by': 'firstName,lastName,bio,interests',
    };
    const filters = [];
    if (interests && interests.length > 0) {
        filters.push(`interests:=[${interests.join(',')}]`);
    }
    if (city) {
        filters.push(`city:${city}`);
    }

    if (filters.length > 0) {
      searchParameters.filter_by = filters.join(' && ');
    }

    const searchResults = await typesense.collections('users').documents().search(searchParameters);

    const userIds = searchResults.hits.map((hit: any) => hit.document.id);

    const profiles = await Promise.all(userIds.map((id: string) => getProfile({ userId: id })));

    return { hits: profiles };
});
