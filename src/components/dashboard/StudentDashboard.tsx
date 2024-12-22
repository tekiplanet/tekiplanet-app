import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Clock, Trophy, Bell, Wallet, Gift, 
  PlayCircle, Calendar, Target, ChevronRight, Star,
  Zap, Award, BookMarked, GraduationCap, Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Mock data
const mockCourses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    progress: 45,
    nextClass: "Tomorrow at 10:00 AM",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613",
    instructor: "Dr. Sarah Johnson",
    totalLessons: 24,
    completedLessons: 11
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    progress: 30,
    nextClass: "Today at 2:00 PM",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    instructor: "Prof. Michael Chen",
    totalLessons: 18,
    completedLessons: 5
  }
];

const mockStats = [
  {
    title: "Wallet Balance",
    value: "₦45,231.89",
    icon: <Wallet className="h-5 w-5 text-primary" />,
    trend: "+₦5,000 this week",
    color: "from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent",
    iconColor: "text-blue-500"
  },
  {
    title: "Study Hours",
    value: "24.5h",
    icon: <Clock className="h-5 w-5 text-primary" />,
    trend: "+2.5h from last week",
    color: "from-green-500/10 via-green-500/5 to-transparent dark:from-green-500/20 dark:via-green-500/10 dark:to-transparent",
    iconColor: "text-green-500"
  },
  {
    title: "Achievements",
    value: "12",
    icon: <Trophy className="h-5 w-5 text-primary" />,
    trend: "3 new badges",
    color: "from-yellow-500/10 via-yellow-500/5 to-transparent dark:from-yellow-500/20 dark:via-yellow-500/10 dark:to-transparent",
    iconColor: "text-yellow-500"
  },
  {
    title: "Course Progress",
    value: "45%",
    icon: <Target className="h-5 w-5 text-primary" />,
    trend: "On track",
    color: "from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-500/20 dark:via-purple-500/10 dark:to-transparent",
    iconColor: "text-purple-500"
  }
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh - replace with actual data fetching
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success("Content refreshed");
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullingContent={
        <div className="flex items-center justify-center py-3 text-sm text-muted-foreground">
          Pull down to refresh...
        </div>
      }
      refreshingContent={
        <div className="flex items-center justify-center gap-2 py-3 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Refreshing...</span>
        </div>
      }
      resistance={1}
    >
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-2 sm:p-4 md:p-6">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-3 sm:mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-3xl blur-3xl" />
          <div className="relative bg-background/50 backdrop-blur-xl rounded-xl sm:rounded-3xl border border-primary/10 p-4 sm:p-6 overflow-hidden">
            {isRefreshing && (
              <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-primary/50 to-primary animate-shimmer" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 ring-2 ring-primary/20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="space-y-2 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold">Welcome back, John! ✨</h1>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Badge variant="outline" className="bg-background/50">
                    <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                    12 Achievements
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    <Clock className="h-3 w-3 mr-1 text-blue-500" />
                    24.5h Study Time
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Make it scrollable on mobile */}
        <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0 mb-4 sm:mb-8">
          <div className="grid grid-cols-[repeat(4,minmax(200px,1fr))] sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-max sm:w-auto">
            {mockStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className={cn(
                  "relative overflow-hidden border-none bg-gradient-to-br backdrop-blur-xl",
                  "hover:shadow-lg transition-all dark:shadow-none",
                  "dark:bg-background/50",
                  stat.color
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl bg-background/50 dark:bg-background/80 backdrop-blur-xl",
                        "group-hover:bg-background/80 dark:group-hover:bg-background/60 transition-colors",
                        "shadow-sm dark:shadow-none"
                      )}>
                        <div className={stat.iconColor}>{stat.icon}</div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                        <p className={cn("text-xs", stat.iconColor)}>{stat.trend}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Course Cards */}
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Continue Learning</h2>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {mockCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group touch-manipulation"
              >
                <Card className="overflow-hidden border-none bg-background/50 backdrop-blur-xl hover:shadow-xl hover:shadow-primary/10 transition-all">
                  <div className="relative aspect-video">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <motion.div 
                      className="absolute top-4 right-4"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Button 
                        size="icon"
                        className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40"
                      >
                        <PlayCircle className="h-5 w-5 text-white" />
                      </Button>
                    </motion.div>
                    <div className="absolute inset-x-4 bottom-4 space-y-2">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 ring-2 ring-white/20">
                            <AvatarFallback>{course.instructor[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-white/80">{course.instructor}</span>
                        </div>
                        <Badge className="bg-white/20 text-white hover:bg-white/30">
                          {course.nextClass}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/10">
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary-foreground"
                          style={{ width: `${course.progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {course.completedLessons}/{course.totalLessons} Lessons
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/dashboard/academy/${course.id}/manage`)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary"
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: <BookMarked />, label: "My Courses", color: "from-blue-500/20 to-blue-600/20" },
            { icon: <Calendar />, label: "Schedule", color: "from-green-500/20 to-green-600/20" },
            { icon: <Award />, label: "Certificates", color: "from-yellow-500/20 to-yellow-600/20" },
            { icon: <GraduationCap />, label: "Learning Path", color: "from-purple-500/20 to-purple-600/20" }
          ].map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group touch-manipulation"
            >
              <Card className="relative overflow-hidden border-primary/10 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer">
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                  action.color
                )} />
                <CardContent className="relative p-4 sm:p-6">
                  <div className="flex flex-col items-center gap-2 sm:gap-3 text-center">
                    <motion.div 
                      className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {action.icon}
                    </motion.div>
                    <span className="font-medium">{action.label}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PullToRefresh>
  );
}