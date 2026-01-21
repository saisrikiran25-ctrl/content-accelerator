import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FileEdit,
  Briefcase,
  ShoppingBag,
  Mail,
  Layout,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Loader2,
  Sparkles,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useContentBriefs } from '@/hooks/useContentBrief';
import { ContentType, ContentBriefFormData } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

const contentTypes: { id: ContentType; name: string; description: string; icon: React.ElementType }[] = [
  { id: 'blog', name: 'Blog Post', description: 'Long-form SEO content', icon: FileText },
  { id: 'article', name: 'Article', description: 'Professional thought leadership', icon: FileEdit },
  { id: 'case_study', name: 'Case Study', description: 'Client success stories', icon: Briefcase },
  { id: 'product_description', name: 'Product Description', description: 'E-commerce product copy', icon: ShoppingBag },
  { id: 'email', name: 'Email Newsletter', description: 'Engaging email content', icon: Mail },
  { id: 'landing_page', name: 'Landing Page', description: 'High-converting page copy', icon: Layout },
];

const toneOptions = [
  { id: 'professional', name: 'Professional', description: 'Formal and authoritative' },
  { id: 'casual', name: 'Casual', description: 'Friendly and conversational' },
  { id: 'technical', name: 'Technical', description: 'Detailed and precise' },
];

const briefSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  topic: z.string().min(1, 'Topic is required').max(500, 'Topic must be less than 500 characters'),
  targetAudience: z.string().max(500, 'Audience description must be less than 500 characters'),
  additionalNotes: z.string().max(2000, 'Notes must be less than 2000 characters'),
});

const TOTAL_STEPS = 4;

export default function ContentBriefWizard() {
  const navigate = useNavigate();
  const { createBrief } = useContentBriefs();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState<ContentBriefFormData>({
    contentType: 'blog',
    title: '',
    topic: '',
    keywords: [],
    targetAudience: '',
    tone: 'professional',
    wordCount: 1000,
    additionalNotes: '',
  });
  
  const [keywordInput, setKeywordInput] = useState('');

  const updateFormData = <K extends keyof ContentBriefFormData>(
    key: K,
    value: ContentBriefFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !formData.keywords.includes(keyword) && formData.keywords.length < 10) {
      updateFormData('keywords', [...formData.keywords, keyword]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    updateFormData('keywords', formData.keywords.filter(k => k !== keyword));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 2) {
      try {
        briefSchema.pick({ topic: true }).parse({ topic: formData.topic });
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          err.errors.forEach(e => {
            if (e.path[0]) newErrors[e.path[0] as string] = e.message;
          });
          setErrors(newErrors);
        }
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Generate title if empty
    const title = formData.title.trim() || `${contentTypes.find(t => t.id === formData.contentType)?.name}: ${formData.topic.slice(0, 50)}`;
    
    try {
      briefSchema.parse({ ...formData, title });
      
      await createBrief.mutateAsync({ ...formData, title });
      toast.success('Content brief created! Starting generation...');
      // Navigate to generator with the brief data
      navigate('/generate', { state: { brief: { ...formData, title } } });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) newErrors[e.path[0] as string] = e.message;
        });
        setErrors(newErrors);
        toast.error('Please fix the errors before submitting');
      } else {
        toast.error('Failed to create content brief');
      }
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground">Create Content Brief</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Content Type Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium text-foreground mb-2">What type of content?</h2>
                <p className="text-muted-foreground">
                  Select the format that best fits your content goals.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {contentTypes.map(type => {
                  const isSelected = formData.contentType === type.id;
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all duration-200 hover-lift ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => updateFormData('contentType', type.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            <type.icon className="h-5 w-5" />
                          </div>
                          {isSelected && <Check className="h-5 w-5 text-primary" />}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-base mb-1">{type.name}</CardTitle>
                        <CardDescription>{type.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Topic & Keywords */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium text-foreground mb-2">Topic & Keywords</h2>
                <p className="text-muted-foreground">
                  What should the content be about?
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-foreground">Topic *</Label>
                  <Textarea
                    id="topic"
                    placeholder="Describe the main topic or subject matter..."
                    value={formData.topic}
                    onChange={e => updateFormData('topic', e.target.value)}
                    className={`min-h-[100px] bg-secondary/50 border-border focus:border-primary ${
                      errors.topic ? 'border-destructive' : ''
                    }`}
                  />
                  {errors.topic && (
                    <p className="text-sm text-destructive">{errors.topic}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Target Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a keyword and press Enter..."
                      value={keywordInput}
                      onChange={e => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeywordKeyDown}
                      className="bg-secondary/50 border-border focus:border-primary"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addKeyword}
                      disabled={!keywordInput.trim() || formData.keywords.length >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.keywords.length}/10 keywords
                  </p>
                  
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.keywords.map(keyword => (
                        <motion.span
                          key={keyword}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Tone Selector */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium text-foreground mb-2">Tone & Style</h2>
                <p className="text-muted-foreground">
                  How should the content sound?
                </p>
              </div>

              <div className="space-y-6">
                {/* Tone selector cards */}
                <div className="grid grid-cols-3 gap-4">
                  {toneOptions.map(tone => {
                    const isSelected = formData.tone === tone.id;
                    return (
                      <Card
                        key={tone.id}
                        className={`cursor-pointer transition-all duration-200 text-center ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/30'
                        }`}
                        onClick={() => updateFormData('tone', tone.id as 'professional' | 'casual' | 'technical')}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className={`text-base ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {tone.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-xs">{tone.description}</CardDescription>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Word count slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Target Word Count</Label>
                    <span className="text-sm font-medium text-primary">
                      {formData.wordCount.toLocaleString()} words
                    </span>
                  </div>
                  <Slider
                    value={[formData.wordCount]}
                    onValueChange={([value]) => updateFormData('wordCount', value)}
                    min={300}
                    max={5000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>300</span>
                    <span>2,500</span>
                    <span>5,000</span>
                  </div>
                </div>

                {/* Target audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-foreground">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Marketing managers at B2B SaaS companies"
                    value={formData.targetAudience}
                    onChange={e => updateFormData('targetAudience', e.target.value)}
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium text-foreground mb-2">Review & Create</h2>
                <p className="text-muted-foreground">
                  Review your content brief before generating.
                </p>
              </div>

              <Card className="border-border bg-card">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Content Type</p>
                      <p className="text-foreground font-medium">
                        {contentTypes.find(t => t.id === formData.contentType)?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tone</p>
                      <p className="text-foreground font-medium capitalize">{formData.tone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Word Count</p>
                      <p className="text-foreground font-medium">{formData.wordCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Target Audience</p>
                      <p className="text-foreground font-medium">
                        {formData.targetAudience || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Topic</p>
                    <p className="text-foreground">{formData.topic}</p>
                  </div>

                  {formData.keywords.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.keywords.map(keyword => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-secondary text-sm rounded-md text-foreground"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific instructions, references, or requirements..."
                  value={formData.additionalNotes}
                  onChange={e => updateFormData('additionalNotes', e.target.value)}
                  className="min-h-[80px] bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between mt-10"
        >
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-border hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button
              onClick={nextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createBrief.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {createBrief.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Brief
                </>
              )}
            </Button>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
