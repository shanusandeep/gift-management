
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Gift = Tables<'gifts'>;
type GiftInsert = TablesInsert<'gifts'>;
type GiftUpdate = TablesUpdate<'gifts'>;

export const useGifts = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGifts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast.error('Failed to load gifts');
    } finally {
      setLoading(false);
    }
  };

  const addGift = async (gift: Omit<GiftInsert, 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('gifts')
        .insert({ ...gift, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setGifts(prev => [data, ...prev]);
      toast.success('Gift added successfully');
      return data;
    } catch (error) {
      console.error('Error adding gift:', error);
      toast.error('Failed to add gift');
    }
  };

  const updateGift = async (id: string, updates: GiftUpdate) => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setGifts(prev => prev.map(gift => gift.id === id ? data : gift));
      toast.success('Gift updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating gift:', error);
      toast.error('Failed to update gift');
    }
  };

  const deleteGift = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGifts(prev => prev.filter(gift => gift.id !== id));
      toast.success('Gift deleted successfully');
    } catch (error) {
      console.error('Error deleting gift:', error);
      toast.error('Failed to delete gift');
    }
  };

  useEffect(() => {
    fetchGifts();
  }, [user]);

  return {
    gifts,
    loading,
    addGift,
    updateGift,
    deleteGift,
    refetch: fetchGifts
  };
};
