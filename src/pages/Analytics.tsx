import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Target,
  TrendingUp,
  Hash,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  Zap,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useContentBriefs } from '@/hooks/useContentBrief';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for analytics
const generateMockData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      seoScore: Math.floor(65 + Math.random() * 25),
      traffic: Math.floor(800 + Math.random() * 600),
      keywords: Math.floor(15 + Math.random() * 20),
      content: Math.floor(1 + Math.random() * 4),
    });
  }
  return data;
};

const seoTrendData = generateMockData(14);
const trafficData = generateMockData(30);

const contentTypeData = [
  { name: 'Blog Posts', value: 45, color: 'hsl(var(--primary))' },
  { name: 'LinkedIn', value: 25, color: 'hsl(187, 96%, 60%)' },
  { name: 'Case Studies', value: 15, color: 'hsl(142, 76%, 46%)' },
  { name: 'Other', value: 15, color: 'hsl(var(--muted-foreground))' },
];

const keywordRankings = [
  { keyword: 'content marketing strategy', position: 3, change: 2, volume: 2400 },
  { keyword: 'SEO content writing', position: 7, change: -1, volume: 1800 },
  { keyword: 'AI content generator', position: 5, change: 4, volume: 3200 },
  { keyword: 'brand voice guidelines', position: 12, change: 0, volume: 890 },
  { keyword: 'content automation tools', position: 8, change: 3, volume: 1500 },
];

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="border-border bg-card hover:border-primary/30 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {trend && (
              <span
                className={`flex items-center text-sm font-medium ${
                  trend.isPositive ? 'text-success' : 'text-destructive'
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Analytics() {
  const { briefs } = useContentBriefs();
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');

  // Calculate metrics based on briefs
  const totalContent = briefs.length;
  const avgWordCount = briefs.length > 0 
    ? Math.round(briefs.reduce((sum, b) => sum + b.word_count, 0) / briefs.length)
    : 0;
  const estimatedHoursSaved = totalContent * 3.5; // Assume 3.5 hours saved per piece

  const chartData = timeRange === '7d' 
    ? seoTrendData.slice(-7) 
    : timeRange === '14d' 
    ? seoTrendData 
    : trafficData;

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
            <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              Track your content performance and ROI.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === '7d' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('7d')}
            >
              7 days
            </Button>
            <Button
              variant={timeRange === '14d' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('14d')}
            >
              14 days
            </Button>
            <Button
              variant={timeRange === '30d' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('30d')}
            >
              30 days
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Hours Saved"
            value={estimatedHoursSaved > 0 ? `${estimatedHoursSaved.toFixed(1)}h` : '0h'}
            subtitle="This month"
            icon={Clock}
            trend={estimatedHoursSaved > 0 ? { value: 23, isPositive: true } : undefined}
            delay={0.1}
          />
          <StatCard
            title="Avg. SEO Score"
            value={totalContent > 0 ? '84' : '--'}
            subtitle="Across all content"
            icon={Target}
            trend={totalContent > 0 ? { value: 12, isPositive: true } : undefined}
            delay={0.15}
          />
          <StatCard
            title="Organic Traffic"
            value={totalContent > 0 ? '2.4K' : '--'}
            subtitle="Monthly visitors"
            icon={TrendingUp}
            trend={totalContent > 0 ? { value: 18, isPositive: true } : undefined}
            delay={0.2}
          />
          <StatCard
            title="Keywords Ranked"
            value={totalContent > 0 ? '47' : '--'}
            subtitle="In top 20 positions"
            icon={Hash}
            trend={totalContent > 0 ? { value: 8, isPositive: true } : undefined}
            delay={0.25}
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* SEO Score Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  SEO Score Trend
                </CardTitle>
                <CardDescription>Average score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="seoGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="seoScore"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#seoGradient)"
                        name="SEO Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Organic Traffic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Organic Traffic
                </CardTitle>
                <CardDescription>Daily visitors from search</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="traffic"
                        stroke="hsl(142, 76%, 46%)"
                        strokeWidth={2}
                        dot={false}
                        name="Visitors"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Content Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Content Distribution
                </CardTitle>
                <CardDescription>By content type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {contentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {contentTypeData.map(type => (
                    <div key={type.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-xs text-muted-foreground">{type.name}</span>
                      <span className="text-xs font-medium text-foreground ml-auto">
                        {type.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Keyword Rankings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="lg:col-span-2"
          >
            <Card className="border-border bg-card h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  Top Keyword Rankings
                </CardTitle>
                <CardDescription>Your best performing keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {keywordRankings.map((kw, index) => (
                    <motion.div
                      key={kw.keyword}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">#{kw.position}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{kw.keyword}</p>
                          <p className="text-xs text-muted-foreground">
                            {kw.volume.toLocaleString()} monthly searches
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {kw.change !== 0 && (
                          <span
                            className={`flex items-center text-xs font-medium ${
                              kw.change > 0 ? 'text-success' : 'text-destructive'
                            }`}
                          >
                            {kw.change > 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(kw.change)}
                          </span>
                        )}
                        {kw.change === 0 && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Content Performance Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Content Output
              </CardTitle>
              <CardDescription>Pieces generated per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar
                      dataKey="content"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      name="Content Pieces"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
