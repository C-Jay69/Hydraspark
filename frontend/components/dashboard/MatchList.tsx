
import React, { useState, useEffect } from 'react';
import { useBackend } from '../../hooks/useBackend';
import Chat from '../chat/Chat';

export default function MatchList() {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const { call } = useBackend();

    useEffect(() => {
        const fetchMatches = async () => {
            const { matches } = await call('match.getMatches');
            setMatches(matches);
        };
        fetchMatches();
    }, [call]);

    if (selectedMatch) {
        return <Chat recipient={selectedMatch} />;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Matches</h2>
            <div className="space-y-4">
                {matches.map((match) => (
                    <div
                        key={match.id}
                        className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedMatch(match)}
                    >
                        <img
                            src={match.profilePicture}
                            alt={match.firstName}
                            className="w-12 h-12 rounded-full mr-4"
                            onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE4MCIgcj0iNjAiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTEwMCAzNTBDMTAwIDMwMC4yOTQgMTM5Ljc5NiAyNjAgMTkwIDI2MEgyMTBDMjYwLjIwNCAyNjAgMzAwIDMwMC4yOTQgMzAwIDM1MFYzODBIMTAwVjM1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                            }}
                        />
                        <span className="font-semibold">{match.firstName}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
