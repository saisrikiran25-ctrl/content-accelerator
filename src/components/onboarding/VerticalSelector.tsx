import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Heart,
  ShoppingCart,
  Cpu,
  Calculator,
  TrendingUp,
  Home,
  Settings,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { getAllVerticals } from '@/lib/verticals';
import { useProfile } from '@/hooks/useProfile';
import { VerticalType } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale,
  Heart,
  ShoppingCart,
  Cpu,
  Calculator,
  TrendingUp,
  Home,
  Settings,
};

export default function VerticalSelector() {
  const [selectedVertical, setSelectedVertical] = useState<VerticalType | null>(null);
  const { selectVertical } = useProfile();
  const navigate = useNavigate();

  const verticals = getAllVerticals();

  const handleContinue = async () => {
    if (!selectedVertical) {
      toast.error('Please select an industry');
      return;
    }

    try {
      await selectVertical.mutateAsync(selectedVertical);
      toast.success('Industry selected! Let\'s create your first content.');
      navigate('/brief');
    } catch (error) {
      toast.error('Failed to save selection. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground mb-3"
          >
            What industry are you in?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto"
          >
            We'll customize your content templates, compliance checks, and AI recommendations
            based on your industry.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {verticals.map((vertical, index) => {
            const Icon = iconMap[vertical.icon] || Settings;
            const isSelected = selectedVertical === vertical.id;

            return (
              <motion.div
                key={vertical.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover-lift h-full ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/30 bg-card'
                  }`}
                  onClick={() => setSelectedVertical(vertical.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </motion.div>
                      )}
                    </div>
                    <CardTitle className="text-base text-foreground">{vertical.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {vertical.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedVertical || selectVertical.isPending}
            className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base"
          >
            {selectVertical.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Continue to Content Brief
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>

        {selectedVertical && selectedVertical !== 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-10 p-6 bg-secondary/50 rounded-xl border border-border"
          >
            <h3 className="font-semibold text-foreground mb-3">
              Compliance checks for {verticals.find(v => v.id === selectedVertical)?.name}:
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {verticals
                .find(v => v.id === selectedVertical)
                ?.complianceRules.map(rule => (
                  <div key={rule.id} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        rule.required ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {rule.name}
                        {rule.required && (
                          <span className="ml-2 text-xs text-primary font-normal">Required</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
