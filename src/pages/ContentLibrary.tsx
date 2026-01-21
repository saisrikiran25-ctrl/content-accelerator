import { useState } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Filter briefs based on search and filters
  const filteredBriefs = briefs.filter(brief => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      brief.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(brief.status);

    // Type filter
    const matchesType = selectedTypes.length === 0 || 
      selectedTypes.includes(brief.content_type);

    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedTypes([]);
  };

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-border hover:bg-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(selectedStatuses.length > 0 || selectedTypes.length > 0) && (
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                    {selectedStatuses.length + selectedTypes.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-3">Status</h4>
                  <div className="space-y-2">
                    {Object.keys(statusColors).map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => toggleStatus(status)}
                        />
                        <Label
                          htmlFor={`status-${status}`}
                          className="text-sm font-normal capitalize cursor-pointer"
                        >
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-3">Content Type</h4>
                  <div className="space-y-2">
                    {Object.entries(contentTypeLabels).map(([type, label]) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                {(selectedStatuses.length > 0 || selectedTypes.length > 0) && (
                  <div className="border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* Content Grid */}
        {filteredBriefs.length === 0 ? (
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
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {briefs.length === 0 ? 'No content yet' : 'No matching content'}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                  {briefs.length === 0 
                    ? 'Create your first content brief to get started with AI-powered content generation.'
                    : 'Try adjusting your search or filters to find what you\'re looking for.'}
                </p>
                {briefs.length === 0 && (
                  <Button
                    onClick={() => navigate('/brief')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Brief
                  </Button>
                )}
                {briefs.length > 0 && filteredBriefs.length === 0 && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
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
            {filteredBriefs.map((brief, index) => (
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
