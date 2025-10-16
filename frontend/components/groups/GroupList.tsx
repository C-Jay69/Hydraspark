
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBackend } from '../../hooks/useBackend';
import GroupChat from './GroupChat';

export default function GroupList() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const { call } = useBackend();

    useEffect(() => {
        const fetchGroups = async () => {
            const { groups } = await call('group.listGroups');
            setGroups(groups);
        };
        fetchGroups();
    }, [call]);

    const handleJoinGroup = async (groupId) => {
        await call('group.joinGroup', { groupId });
        // You might want to update the UI to show the user has joined the group
    };

    if (selectedGroup) {
        return <GroupChat groupName={selectedGroup.name} />;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Community Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => (
                    <Card key={group.id}>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">{group.description}</p>
                            <div className="flex justify-between">
                                <Button onClick={() => setSelectedGroup(group)}>
                                    View Chat
                                </Button>
                                <Button onClick={() => handleJoinGroup(group.id)} variant="outline">
                                    Join Group
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
