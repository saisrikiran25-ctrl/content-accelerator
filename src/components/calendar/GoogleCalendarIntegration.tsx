import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface GoogleCalendarIntegrationProps {
  contentTitle: string;
  scheduledDate: Date;
  contentDescription?: string;
}

export default function GoogleCalendarIntegration({
  contentTitle,
  scheduledDate,
  contentDescription,
}: GoogleCalendarIntegrationProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate Google Calendar link
  const generateGoogleCalendarLink = () => {
    const event = {
      title: `Upload Content: ${contentTitle}`,
      description: contentDescription || `Remember to upload your content: ${contentTitle}`,
      start: scheduledDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: new Date(scheduledDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    };

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}`;
    
    return url;
  };

  // Generate .ics file for download
  const generateICSFile = () => {
    setIsGenerating(true);
    
    try {
      const start = scheduledDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const end = new Date(scheduledDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ContentAccel//Calendar//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@contentaccel.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:Upload Content: ${contentTitle}`,
        `DESCRIPTION:${contentDescription || `Remember to upload your content: ${contentTitle}`}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `content-reminder-${contentTitle.toLowerCase().replace(/\s+/g, '-')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Calendar file downloaded!');
    } catch (error) {
      console.error('Error generating ICS file:', error);
      toast.error('Failed to generate calendar file');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToGoogleCalendar = () => {
    const url = generateGoogleCalendarLink();
    window.open(url, '_blank');
    toast.success('Opening Google Calendar...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Google Calendar Integration</CardTitle>
          </div>
          <CardDescription>
            Add this content reminder to your Google Calendar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleAddToGoogleCalendar}
            className="w-full"
            variant="default"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Add to Google Calendar
          </Button>
          <Button
            onClick={generateICSFile}
            className="w-full"
            variant="outline"
            disabled={isGenerating}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download .ics file'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            The .ics file works with Google Calendar, Outlook, and Apple Calendar
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
