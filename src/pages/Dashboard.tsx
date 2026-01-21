import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  Clock,
  Target,
  ArrowUpRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContentBriefs } from '@/hooks/useContentBrief';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const navigate = useNavigate();
  const { briefs } = useContentBriefs();

  // Constants for SEO score calculation
  const SEO_KEYWORDS_SCORE_MULTIPLIER = 5;
  const SEO_MAX_KEYWORD_SCORE = 25;
  const SEO_TARGET_WORD_COUNT = 1000;
  const SEO_MAX_WORD_SCORE = 25;
  const SEO_BASE_SCORE = 50;

  // Calculate actual statistics from briefs
  const totalContent = briefs.length;
  const thisMonthContent = briefs.filter(brief => {
    const createdDate = new Date(brief.created_at);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && 
           createdDate.getFullYear() === now.getFullYear();
  }).length;
  
  // Estimate hours saved (average 2 hours per content piece)
  const hoursSaved = Math.round(thisMonthContent * 2);
  
  // Calculate average word count for SEO score estimation
  const avgWordCount = briefs.length > 0 
    ? Math.round(briefs.reduce((sum, brief) => sum + brief.word_count, 0) / briefs.length)
    : 0;
  
  // Estimate SEO score based on word count and keywords
  const avgSEOScore = briefs.length > 0
    ? Math.round(briefs.reduce((sum, brief) => {
        // Simple estimation: base score + keyword count + word count factor
        const keywordScore = Math.min(brief.keywords.length * SEO_KEYWORDS_SCORE_MULTIPLIER, SEO_MAX_KEYWORD_SCORE);
        const wordScore = brief.word_count >= SEO_TARGET_WORD_COUNT 
          ? SEO_MAX_WORD_SCORE 
          : Math.round((brief.word_count / SEO_TARGET_WORD_COUNT) * SEO_MAX_WORD_SCORE);
        return sum + SEO_BASE_SCORE + keywordScore + wordScore;
      }, 0) / briefs.length)
    : 0;

  const stats = [
    {
      title: 'Content Generated',
      value: thisMonthContent.toString(),
      subtitle: 'pieces this month',
      icon: FileText,
      trend: null,
    },
    {
      title: 'Hours Saved',
      value: hoursSaved.toString(),
      subtitle: 'this month',
      icon: Clock,
      trend: null,
    },
    {
      title: 'Avg. SEO Score',
      value: avgSEOScore > 0 ? avgSEOScore.toString() : '--',
      subtitle: 'across all content',
      icon: Target,
      trend: null,
    },
    {
      title: 'Total Content',
      value: totalContent.toString(),
      subtitle: 'all time',
      icon: TrendingUp,
      trend: null,
    },
  ];

  const quickActions = [
    {
      title: 'Create Content Brief',
      description: 'Start a new AI-powered content piece',
      icon: Sparkles,
      href: '/brief',
      primary: true,
    },
    {
      title: 'View Library',
      description: 'Browse your content collection',
      icon: FileText,
      href: '/library',
      primary: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to ContentAccelerator. Start creating content or explore your analytics.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <Card
              key={stat.title}
              className="bg-card border-border hover:border-primary/30 transition-colors duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                className={`group cursor-pointer transition-all duration-200 hover-lift ${
                  action.primary
                    ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
                    : 'bg-card border-border hover:border-primary/30'
                }`}
                onClick={() => navigate(action.href)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        action.primary
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight
                      className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        action.primary ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <CardTitle className="text-foreground">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Empty State - Recent Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">Recent Content</h2>
          <Card className="border-dashed border-2 border-border bg-secondary/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No content yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                Create your first content piece to get started. Our AI will help you generate
                SEO-optimized content in minutes.
              </p>
              <Button
                onClick={() => navigate('/brief')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
