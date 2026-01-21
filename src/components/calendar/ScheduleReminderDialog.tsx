import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, addHours } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/hooks/useNotifications';
import GoogleCalendarIntegration from './GoogleCalendarIntegration';
import { toast } from 'sonner';

interface ScheduleReminderDialogProps {
  contentTitle: string;
  contentId: string;
  scheduledDate?: Date;
}

export default function ScheduleReminderDialog({
  contentTitle,
  contentId,
  scheduledDate,
}: ScheduleReminderDialogProps) {
  const { createNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState<string>('1hour');
  const [customDate, setCustomDate] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('09:00');

  const defaultDate = scheduledDate || new Date();

  const getReminderDate = (): Date => {
    if (reminderTime === 'custom' && customDate) {
      const [hours, minutes] = customTime.split(':');
      const date = new Date(customDate);
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date;
    }

    const now = new Date();
    switch (reminderTime) {
      case '15min':
        return addMinutes(now, 15);
      case '30min':
        return addMinutes(now, 30);
      case '1hour':
        return addHours(now, 1);
      case '1day':
        return addDays(now, 1);
      case '3days':
        return addDays(now, 3);
      case '1week':
        return addDays(now, 7);
      default:
        return addHours(now, 1);
    }
  };

  const addMinutes = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
  };

  const handleScheduleReminder = () => {
    const notificationDate = getReminderDate();
    
    createNotification(
      contentId,
      `Content Reminder: ${contentTitle}`,
      `Time to upload your content: ${contentTitle}`,
      notificationDate
    );

    toast.success('Reminder scheduled!', {
      description: `You'll be notified on ${format(notificationDate, 'PPp')}`,
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Set Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Content Reminder</DialogTitle>
          <DialogDescription>
            Set up reminders and calendar events for "{contentTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* In-App Notification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium">In-App Notification</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="reminder-time">When would you like to be reminded?</Label>
                <Select value={reminderTime} onValueChange={setReminderTime}>
                  <SelectTrigger id="reminder-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">In 15 minutes</SelectItem>
                    <SelectItem value="30min">In 30 minutes</SelectItem>
                    <SelectItem value="1hour">In 1 hour</SelectItem>
                    <SelectItem value="1day">Tomorrow</SelectItem>
                    <SelectItem value="3days">In 3 days</SelectItem>
                    <SelectItem value="1week">In 1 week</SelectItem>
                    <SelectItem value="custom">Custom date & time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reminderTime === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor="custom-date">Date</Label>
                    <Input
                      id="custom-date"
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-time">Time</Label>
                    <Input
                      id="custom-time"
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              <Button onClick={handleScheduleReminder} className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Schedule In-App Reminder
              </Button>
            </div>
          </div>

          {/* Google Calendar Integration */}
          <div className="border-t border-border pt-4">
            <GoogleCalendarIntegration
              contentTitle={contentTitle}
              scheduledDate={defaultDate}
              contentDescription={`Don't forget to upload your content: ${contentTitle}`}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
