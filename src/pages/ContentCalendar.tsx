import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  getDay,
} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useContentBriefs } from '@/hooks/useContentBrief';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScheduleReminderDialog from '@/components/calendar/ScheduleReminderDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const statusColors: Record<string, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  scheduled: 'bg-primary/10 text-primary',
  published: 'bg-success/10 text-success',
  archived: 'bg-muted text-muted-foreground',
};

export default function ContentCalendar() {
  const navigate = useNavigate();
  const { briefs } = useContentBriefs();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - getDay(monthStart));
  
  const endDate = new Date(monthEnd);
  const daysToAdd = 6 - getDay(monthEnd);
  endDate.setDate(endDate.getDate() + daysToAdd);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const getBriefsForDate = (date: Date) => {
    return briefs.filter(brief => {
      const briefDate = new Date(brief.created_at);
      return isSameDay(briefDate, date);
    });
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

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
            <h1 className="text-2xl font-semibold text-foreground">Content Calendar</h1>
            <p className="text-muted-foreground">
              Plan your content schedule and set reminders.
            </p>
          </div>
          <Button
            onClick={() => navigate('/brief')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </motion.div>

        {/* Calendar Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={goToToday} className="ml-2">
              Today
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="w-32" /> {/* Spacer for alignment */}
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card overflow-hidden">
            <CardContent className="p-0">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {WEEKDAYS.map(day => (
                  <div
                    key={day}
                    className="py-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const dayBriefs = getBriefsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);

                  return (
                    <motion.div
                      key={day.toISOString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-[120px] p-2 border-r border-b border-border last:border-r-0 cursor-pointer transition-colors ${
                        !isCurrentMonth
                          ? 'bg-secondary/30'
                          : isSelected
                          ? 'bg-primary/5'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                            isTodayDate
                              ? 'bg-primary text-primary-foreground'
                              : isCurrentMonth
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {format(day, 'd')}
                        </span>
                        {dayBriefs.length > 0 && (
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-1">
                        {dayBriefs.slice(0, 2).map(brief => (
                          <div
                            key={brief.id}
                            className="group flex items-center gap-1 p-1.5 bg-secondary/80 hover:bg-secondary rounded text-xs transition-colors"
                          >
                            <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="truncate text-foreground flex-1">
                              {brief.title}
                            </span>
                            <Badge className={`text-[10px] px-1 py-0 ${statusColors[brief.status]}`}>
                              {brief.status}
                            </Badge>
                          </div>
                        ))}
                        {dayBriefs.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayBriefs.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Date Panel */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="flex gap-2">
                    {getBriefsForDate(selectedDate).length > 0 && (
                      <ScheduleReminderDialog
                        contentTitle={getBriefsForDate(selectedDate)[0].title}
                        contentId={getBriefsForDate(selectedDate)[0].id}
                        scheduledDate={selectedDate}
                      />
                    )}
                    <Button
                      onClick={() => navigate('/brief')}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Content
                    </Button>
                  </div>
                </div>

                {getBriefsForDate(selectedDate).length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No content scheduled for this date.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getBriefsForDate(selectedDate).map(brief => (
                      <div
                        key={brief.id}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">{brief.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {brief.topic?.slice(0, 50)}...
                            </p>
                          </div>
                        </div>
                        <Badge className={statusColors[brief.status]}>{brief.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
