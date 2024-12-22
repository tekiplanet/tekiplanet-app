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
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-2 sm:p-4 md:p-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-3 sm:mb-8"
      >
        <Card className={cn(
          "relative overflow-hidden border-none bg-gradient-to-br backdrop-blur-xl",
          "hover:shadow-lg transition-all dark:shadow-none",
          "dark:bg-background/50",
          "from-blue-500/10 via-blue-500/5 to-transparent",
          "dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent"
        )}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {/* Welcome Text */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl font-bold"
                  >
                    Welcome back, John! ✨
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-muted-foreground"
                  >
                    Ready to continue your learning journey?
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary"
                >
                  <GraduationCap className="h-6 w-6" />
                </motion.div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10"
                >
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-yellow-500/70">Achievements</p>
                    <p className="text-sm font-semibold text-yellow-500">12 Earned</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10"
                >
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-500/70">Study Time</p>
                    <p className="text-sm font-semibold text-blue-500">24.5h</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid - Make it scrollable on mobile with snap points */}
      <div className="w-full mb-6 overflow-x-auto">
        <div className="flex space-x-3 pb-4 px-2 snap-x snap-mandatory">
          {mockStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group snap-center"
              style={{ minWidth: '80%', maxWidth: '300px' }}
            >
              <Card className={cn(
                "relative overflow-hidden border-none bg-gradient-to-br backdrop-blur-xl",
                "hover:shadow-lg transition-all dark:shadow-none rounded-2xl",
                "dark:bg-background/50",
                stat.color
              )}>
                <CardContent className="p-4">
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
                      <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                      <p className={cn("text-xs", stat.iconColor)}>{stat.trend}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Course Cards - Horizontal scroll on mobile */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold">Continue Learning</h2>
          <Button variant="ghost" size="sm" className="text-xs">
            View All <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4 pb-4 px-2 snap-x snap-mandatory">
            {mockCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group touch-manipulation snap-center"
                style={{ minWidth: '300px' }}
              >
                <Card className="overflow-hidden border-none bg-background/50 backdrop-blur-xl hover:shadow-xl hover:shadow-primary/10 transition-all rounded-2xl">
                  <div className="relative aspect-video">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <motion.div 
                      className="absolute top-3 right-3"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Button 
                        size="icon"
                        className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 h-8 w-8"
                      >
                        <PlayCircle className="h-4 w-4 text-white" />
                      </Button>
                    </motion.div>
                    <div className="absolute inset-x-3 bottom-3 space-y-1.5">
                      <h3 className="text-base font-semibold text-white line-clamp-1">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5 ring-1 ring-white/20">
                            <AvatarFallback className="text-xs">{course.instructor[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-white/80">{course.instructor}</span>
                        </div>
                        <Badge className="bg-white/20 text-white hover:bg-white/30 text-[10px] py-0.5">
                          {course.nextClass}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary-foreground"
                          style={{ width: `${course.progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {course.completedLessons}/{course.totalLessons} Lessons
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/dashboard/academy/${course.id}/manage`)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary text-xs h-7 rounded-lg"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 px-2">
        {[
          { icon: <BookMarked className="h-5 w-5" />, label: "My Courses", color: "from-blue-500/20 to-blue-600/20" },
          { icon: <Calendar className="h-5 w-5" />, label: "Schedule", color: "from-green-500/20 to-green-600/20" },
          { icon: <Award className="h-5 w-5" />, label: "Certificates", color: "from-yellow-500/20 to-yellow-600/20" },
          { icon: <GraduationCap className="h-5 w-5" />, label: "Learning Path", color: "from-purple-500/20 to-purple-600/20" }
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group touch-manipulation"
          >
            <Card className="relative overflow-hidden border-primary/10 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer rounded-2xl">
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                action.color
              )} />
              <CardContent className="relative p-3">
                <div className="flex flex-col items-center gap-2 text-center">
                  <motion.div 
                    className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {action.icon}
                  </motion.div>
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}