import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  Target,
  Loader2,
} from 'lucide-react';
import { useContentBriefs } from '@/hooks/useContentBrief';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<string, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  scheduled: 'bg-warning/10 text-warning',
  published: 'bg-success/10 text-success',
  archived: 'bg-muted text-muted-foreground',
};

const contentTypeLabels: Record<string, string> = {
  blog: 'Blog Post',
  article: 'Article',
  case_study: 'Case Study',
  product_description: 'Product',
  email: 'Email',
  landing_page: 'Landing Page',
};

export default function ContentLibrary() {
  const navigate = useNavigate();
  const { briefs, isLoading } = useContentBriefs();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Content Library</h1>
            <p className="text-muted-foreground">
              Manage and organize all your content briefs and generated pieces.
            </p>
          </div>
          <Button
            onClick={() => navigate('/brief')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Brief
          </Button>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              className="pl-10 bg-secondary/50 border-border focus:border-primary"
            />
          </div>
          <Button variant="outline" className="border-border hover:bg-secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </motion.div>

        {/* Content Grid */}
        {briefs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-dashed border-2 border-border bg-secondary/20">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No content yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                  Create your first content brief to get started with AI-powered content generation.
                </p>
                <Button
                  onClick={() => navigate('/brief')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Brief
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4"
          >
            {briefs.map((brief, index) => (
              <motion.div
                key={brief.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card 
                  className="border-border bg-card hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => navigate('/generate', { state: { brief, readOnly: true } })}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base text-foreground">
                          {brief.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {brief.topic || 'No topic specified'}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {contentTypeLabels[brief.content_type] || brief.content_type}
                        </Badge>
                        <Badge className={`text-xs ${statusColors[brief.status]}`}>
                          {brief.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {brief.word_count.toLocaleString()} words
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(brief.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {brief.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {brief.keywords.slice(0, 5).map(keyword => (
                          <span
                            key={keyword}
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                        {brief.keywords.length > 5 && (
                          <span className="px-2 py-0.5 text-muted-foreground text-xs">
                            +{brief.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
