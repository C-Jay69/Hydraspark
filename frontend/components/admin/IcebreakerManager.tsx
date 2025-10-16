
import React, { useState, useEffect } from 'react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Icebreaker {
  id: string;
  type: string;
  data: any;
}

export default function IcebreakerManager() {
  const [icebreakers, setIcebreakers] = useState<Icebreaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { call } = useBackend();

  useEffect(() => {
    fetchIcebreakers();
  }, []);

  const fetchIcebreakers = async () => {
    setIsLoading(true);
    try {
      const { icebreakers } = await call('admin.listIcebreakers');
      setIcebreakers(icebreakers);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch icebreakers');
    }
    setIsLoading(false);
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const type = formData.get('type') as string;
    const data = JSON.parse(formData.get('data') as string);

    try {
      await call('admin.createIcebreaker', { type, data });
      fetchIcebreakers(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to create icebreaker');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this icebreaker?')) {
      try {
        await call('admin.deleteIcebreaker', { id });
        fetchIcebreakers(); // Refresh list
      } catch (err: any) {
        setError(err.message || 'Failed to delete icebreaker');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Icebreaker Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleCreate} className="mb-6 p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Add New Icebreaker</h3>
        <Input name="type" placeholder="Type (e.g., two_truths_one_lie)" required className="mb-2" />
        <Textarea name="data" placeholder='Data (JSON format)' required className="mb-2" />
        <Button type="submit">Add Icebreaker</Button>
      </form>

      {isLoading ? (
        <p>Loading icebreakers...</p>
      ) : (
        <div className="space-y-4">
          {icebreakers.map((ib) => (
            <div key={ib.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold">{ib.type}</p>
                <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(ib.data, null, 2)}</pre>
              </div>
              <Button variant="destructive" onClick={() => handleDelete(ib.id)}>Delete</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

