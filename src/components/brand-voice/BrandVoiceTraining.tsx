import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Sparkles,
  Save,
  Loader2,
  Info,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { BrandVoice } from '@/types/database';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const voiceAttributes = [
  {
    id: 'formality',
    name: 'Formality',
    description: 'How formal vs casual is your writing?',
    low: 'Casual',
    high: 'Formal',
  },
  {
    id: 'complexity',
    name: 'Complexity',
    description: 'How simple vs technical is your vocabulary?',
    low: 'Simple',
    high: 'Technical',
  },
  {
    id: 'warmth',
    name: 'Warmth',
    description: 'How professional vs friendly is your tone?',
    low: 'Professional',
    high: 'Friendly',
  },
  {
    id: 'confidence',
    name: 'Confidence',
    description: 'How humble vs bold are your statements?',
    low: 'Humble',
    high: 'Bold',
  },
];

export default function BrandVoiceTraining() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sampleText, setSampleText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch brand voice
  const { data: brandVoice, isLoading } = useQuery({
    queryKey: ['brand-voice', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as BrandVoice | null;
    },
    enabled: !!user?.id,
  });

  // Local state for sliders
  const [values, setValues] = useState({
    formality: brandVoice?.formality ?? 50,
    complexity: brandVoice?.complexity ?? 50,
    warmth: brandVoice?.warmth ?? 50,
    confidence: brandVoice?.confidence ?? 50,
  });

  // Update local state when data loads
  useEffect(() => {
    if (brandVoice) {
      setValues({
        formality: brandVoice.formality,
        complexity: brandVoice.complexity,
        warmth: brandVoice.warmth,
        confidence: brandVoice.confidence,
      });
    }
  }, [brandVoice]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      if (brandVoice) {
        const { error } = await supabase
          .from('brand_voices')
          .update({
            formality: values.formality,
            complexity: values.complexity,
            warmth: values.warmth,
            confidence: values.confidence,
          })
          .eq('id', brandVoice.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('brand_voices')
          .insert({
            user_id: user.id,
            name: 'Default',
            formality: values.formality,
            complexity: values.complexity,
            warmth: values.warmth,
            confidence: values.confidence,
            is_active: true,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-voice', user?.id] });
      toast.success('Brand voice saved successfully!');
    },
    onError: () => {
      toast.error('Failed to save brand voice');
    },
  });

  const handleAnalyzeSample = () => {
    if (!sampleText.trim()) {
      toast.error('Please enter some sample text to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis with random adjustments
    setTimeout(() => {
      const analyzed = {
        formality: Math.min(100, Math.max(0, 50 + Math.floor(Math.random() * 40 - 20))),
        complexity: Math.min(100, Math.max(0, 50 + Math.floor(Math.random() * 40 - 20))),
        warmth: Math.min(100, Math.max(0, 50 + Math.floor(Math.random() * 40 - 20))),
        confidence: Math.min(100, Math.max(0, 50 + Math.floor(Math.random() * 40 - 20))),
      };
      
      setValues(analyzed);
      setIsAnalyzing(false);
      toast.success('Sample analyzed! Adjust the sliders if needed.');
    }, 2000);
  };

  const updateValue = (key: keyof typeof values, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2">Brand Voice Training</h1>
          <p className="text-muted-foreground">
            Train the AI to match your unique writing style. Upload samples or adjust manually.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sample Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border bg-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Analyze Your Writing
                </CardTitle>
                <CardDescription>
                  Paste 3-5 samples of your best content. We'll analyze your style.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your writing samples here... Include at least 500 words for best results."
                  value={sampleText}
                  onChange={e => setSampleText(e.target.value)}
                  className="min-h-[200px] bg-secondary/50 border-border focus:border-primary resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {sampleText.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <Button
                    onClick={handleAnalyzeSample}
                    disabled={isAnalyzing || sampleText.split(/\s+/).filter(Boolean).length < 50}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Style
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Voice Profile */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border bg-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    Voice Profile
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Adjust these sliders to fine-tune how the AI writes content for you.
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>
                  Fine-tune your brand voice attributes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {voiceAttributes.map(attr => (
                  <div key={attr.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">{attr.name}</Label>
                      <span className="text-sm font-medium text-primary">
                        {values[attr.id as keyof typeof values]}%
                      </span>
                    </div>
                    <Slider
                      value={[values[attr.id as keyof typeof values]]}
                      onValueChange={([value]) => updateValue(attr.id as keyof typeof values, value)}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{attr.low}</span>
                      <span>{attr.high}</span>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Brand Voice
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-dashed border-2 border-border bg-secondary/20">
            <CardHeader>
              <CardTitle className="text-base">Voice Preview</CardTitle>
              <CardDescription>
                Based on your settings, content will be written with:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {voiceAttributes.map(attr => {
                  const value = values[attr.id as keyof typeof values];
                  const label = value < 40 ? attr.low : value > 60 ? attr.high : 'Balanced';
                  return (
                    <div key={attr.id} className="text-center p-3 bg-card rounded-lg border border-border">
                      <div className="text-2xl font-bold text-gradient">{value}%</div>
                      <div className="text-xs text-muted-foreground mt-1">{attr.name}</div>
                      <div className="text-sm font-medium text-foreground mt-1">{label}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
