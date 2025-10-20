
import React, { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { ProfileResponse } from "../../../../declarations/backend/backend.did";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [results, setResults] = useState<ProfileResponse[]>([]);
  const { backend } = useBackend();

  const handleSearch = async () => {
    if (backend) {
      const response = await backend.searchUsers(query, interests, city);
      setResults(response.hits);
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setInterests((prev) => [...prev, value]);
    } else {
      setInterests((prev) => prev.filter((interest) => interest !== value));
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
      <div>
        <h4>Interests:</h4>
        <label>
          <input type="checkbox" value="sports" onChange={handleInterestChange} />
          Sports
        </label>
        <label>
          <input type="checkbox" value="music" onChange={handleInterestChange} />
          Music
        </label>
        <label>
          <input type="checkbox" value="reading" onChange={handleInterestChange} />
          Reading
        </label>
      </div>
      <div>
        <h4>City:</h4>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
        />
      </div>
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.map((user) => (
          <div key={user.id}>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.bio}</p>
            <p>Interests: {user.interests.join(", ")}</p>
            <p>City: {user.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
