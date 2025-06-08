
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Recipient = Tables<'recipients'>;
type RecipientInsert = TablesInsert<'recipients'>;
type RecipientUpdate = TablesUpdate<'recipients'>;

export const useRecipients = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecipients = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      toast.error('Failed to load recipients');
    } finally {
      setLoading(false);
    }
  };

  const addRecipient = async (recipient: Omit<RecipientInsert, 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recipients')
        .insert({ ...recipient, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setRecipients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Recipient added successfully');
      return data;
    } catch (error) {
      console.error('Error adding recipient:', error);
      toast.error('Failed to add recipient');
    }
  };

  const updateRecipient = async (id: string, updates: RecipientUpdate) => {
    try {
      const { data, error } = await supabase
        .from('recipients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRecipients(prev => prev.map(recipient => recipient.id === id ? data : recipient));
      toast.success('Recipient updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating recipient:', error);
      toast.error('Failed to update recipient');
    }
  };

  const deleteRecipient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecipients(prev => prev.filter(recipient => recipient.id !== id));
      toast.success('Recipient deleted successfully');
    } catch (error) {
      console.error('Error deleting recipient:', error);
      toast.error('Failed to delete recipient');
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, [user]);

  return {
    recipients,
    loading,
    addRecipient,
    updateRecipient,
    deleteRecipient,
    refetch: fetchRecipients
  };
};
