import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { ContentBrief, ContentBriefFormData, ContentType } from '@/types/database';

export function useContentBriefs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const briefsQuery = useQuery({
    queryKey: ['content-briefs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('content_briefs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContentBrief[];
    },
    enabled: !!user?.id,
  });

  const createBrief = useMutation({
    mutationFn: async (formData: ContentBriefFormData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('content_briefs')
        .insert({
          user_id: user.id,
          title: formData.title,
          content_type: formData.contentType as ContentType,
          topic: formData.topic,
          keywords: formData.keywords,
          target_audience: formData.targetAudience,
          tone: formData.tone,
          word_count: formData.wordCount,
          additional_notes: formData.additionalNotes,
          status: 'draft',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as ContentBrief;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-briefs', user?.id] });
    },
  });

  const updateBrief = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContentBrief> & { id: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('content_briefs')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as ContentBrief;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-briefs', user?.id] });
    },
  });

  const deleteBrief = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('content_briefs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-briefs', user?.id] });
    },
  });

  return {
    briefs: briefsQuery.data ?? [],
    isLoading: briefsQuery.isLoading,
    error: briefsQuery.error,
    createBrief,
    updateBrief,
    deleteBrief,
  };
}
