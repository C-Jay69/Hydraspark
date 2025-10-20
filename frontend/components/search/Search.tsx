
import React, { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { ProfileResponse } from "../../../../declarations/backend/backend.did";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResponse[]>([]);
  const { backend } = useBackend();

  const handleSearch = async () => {
    if (backend) {
      const response = await backend.searchUsers(query, [], "");
      setResults(response.hits);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for users..."
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.map((user) => (
          <div key={user.id}>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
