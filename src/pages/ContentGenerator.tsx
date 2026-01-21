import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  StopCircle,
  Copy,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Target,
  BookOpen,
  Type,
  Link2,
  Image,
  Hash,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { ContentBriefFormData } from '@/types/database';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface SEOMetrics {
  overallScore: number;
  keywordDensity: number;
  readabilityScore: number;
  headingStructure: boolean;
  metaDescription: boolean;
  wordCount: number;
  internalLinks: number;
  images: number;
}

const calculateSEOMetrics = (content: string, keywords: string[]): SEOMetrics => {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const lowerContent = content.toLowerCase();
  
  // Keyword density
  const keywordMatches = keywords.reduce((count, kw) => {
    const regex = new RegExp(kw.toLowerCase(), 'gi');
    return count + (lowerContent.match(regex)?.length || 0);
  }, 0);
  const keywordDensity = wordCount > 0 ? Math.min(100, (keywordMatches / wordCount) * 100 * 20) : 0;
  
  // Heading structure
  const hasH1 = content.includes('# ') || content.includes('<h1');
  const hasH2 = content.includes('## ') || content.includes('<h2');
  const headingStructure = hasH1 && hasH2;
  
  // Meta description
  const metaDescription = content.includes('[META]');
  
  // Internal links
  const linkMatches = content.match(/\[LINK:/gi);
  const internalLinks = linkMatches?.length || 0;
  
  // Images
  const imageMatches = content.match(/!\[|<img/gi);
  const images = imageMatches?.length || 0;
  
  // Readability (simple Flesch-like score based on sentence length)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 3));
  
  // Overall score
  const overallScore = Math.round(
    (keywordDensity * 0.25) +
    (readabilityScore * 0.25) +
    (headingStructure ? 20 : 0) +
    (metaDescription ? 15 : 0) +
    (Math.min(internalLinks, 3) * 5) +
    (Math.min(images, 2) * 5)
  );
  
  return {
    overallScore: Math.min(100, overallScore),
    keywordDensity: Math.round(keywordDensity),
    readabilityScore: Math.round(readabilityScore),
    headingStructure,
    metaDescription,
    wordCount,
    internalLinks,
    images,
  };
};

export default function ContentGenerator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useProfile();
  
  const brief = location.state?.brief as ContentBriefFormData | undefined;
  const readOnly = location.state?.readOnly || false;
  
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const seoMetrics = calculateSEOMetrics(content, brief?.keywords || []);

  const startGeneration = useCallback(async () => {
    if (!brief) {
      toast.error('No content brief found. Please create one first.');
      navigate('/brief');
      return;
    }

    setIsGenerating(true);
    setIsComplete(false);
    setError(null);
    setContent('');
    
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            brief: {
              ...brief,
              vertical: profile?.vertical || 'custom',
            },
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            setIsComplete(true);
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              setContent(prev => prev + delta);
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      setIsComplete(true);
      toast.success('Content generated successfully!');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        toast.info('Generation stopped');
      } else {
        const message = err instanceof Error ? err.message : 'Failed to generate content';
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [brief, profile, navigate]);

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
  };

  const downloadContent = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brief?.topic?.slice(0, 30) || 'content'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Content downloaded!');
  };

  if (!brief) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Content Brief</h2>
          <p className="text-muted-foreground mb-6">Create a content brief first to generate content.</p>
          <Button onClick={() => navigate('/brief')} className="bg-primary hover:bg-primary/90">
            Create Content Brief
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-2xl font-semibold text-foreground">AI Content Generator</h1>
              <p className="text-muted-foreground text-sm mt-1">{brief.topic}</p>
            </div>
            <div className="flex items-center gap-3">
              {!readOnly && (
                <>
                  {isGenerating ? (
                    <Button
                      onClick={stopGeneration}
                      variant="destructive"
                      className="gap-2"
                    >
                      <StopCircle className="h-4 w-4" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      onClick={startGeneration}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {content ? 'Regenerate' : 'Generate'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Content Display */}
          <Card className="flex-1 border-border bg-card overflow-hidden">
            <CardContent className="p-6 h-full overflow-auto">
              {!content && !isGenerating && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {readOnly ? 'No Content Generated' : 'Ready to Generate'}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    {readOnly 
                      ? 'This content brief has not been generated yet.'
                      : 'Click the Generate button to create SEO-optimized content based on your brief.'
                    }
                  </p>
                  {!readOnly && (
                    <Button
                      onClick={startGeneration}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Generating
                    </Button>
                  )}
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Generation Failed</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-6">{error}</p>
                  <Button onClick={startGeneration} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {(content || isGenerating) && !error && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                    {content}
                    {isGenerating && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                        className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
                      />
                    )}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Bar */}
          <AnimatePresence>
            {content && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-between mt-4 p-4 bg-secondary/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{seoMetrics.wordCount.toLocaleString()} words {readOnly ? 'in content' : 'generated'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadContent}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {!readOnly && (
                    <Button variant="outline" size="sm" onClick={startGeneration}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SEO Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex-shrink-0 space-y-4"
        >
          {/* SEO Score Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                SEO Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <span
                  className={`text-4xl font-bold ${
                    seoMetrics.overallScore >= 80
                      ? 'text-success'
                      : seoMetrics.overallScore >= 60
                      ? 'text-warning'
                      : 'text-muted-foreground'
                  }`}
                >
                  {seoMetrics.overallScore}
                </span>
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <Progress value={seoMetrics.overallScore} className="h-2" />
            </CardContent>
          </Card>

          {/* Metrics Breakdown */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Content Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    Keyword Density
                  </span>
                  <span className="font-medium text-foreground">{seoMetrics.keywordDensity}%</span>
                </div>
                <Progress value={seoMetrics.keywordDensity} className="h-1.5" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    Readability
                  </span>
                  <span className="font-medium text-foreground">{seoMetrics.readabilityScore}%</span>
                </div>
                <Progress value={seoMetrics.readabilityScore} className="h-1.5" />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Type className="h-4 w-4" />
                    Heading Structure
                  </span>
                  {seoMetrics.headingStructure ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Type className="h-4 w-4" />
                    Meta Description
                  </span>
                  {seoMetrics.metaDescription ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Link2 className="h-4 w-4" />
                    Internal Links
                  </span>
                  <span className="font-medium text-foreground">{seoMetrics.internalLinks}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Image className="h-4 w-4" />
                    Images
                  </span>
                  <span className="font-medium text-foreground">{seoMetrics.images}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          {brief.keywords.length > 0 && (
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Target Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {brief.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.aside>
      </div>
    </DashboardLayout>
  );
}
