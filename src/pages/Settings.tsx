import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Search,
  ChevronRight, 
  User, 
  Building2, 
  Briefcase,
  Shield, 
  Bell, 
  Settings as SettingsIcon,
  Moon,
  Sun,
  ArrowLeft
} from 'lucide-react';

// Animation variants
const pageTransition = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 }
};

interface SettingsGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

const Settings = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { theme, setTheme, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Define settings groups
  const settingsGroups: SettingsGroup[] = [
    {
      id: 'quick',
      title: 'Quick Settings',
      icon: <SettingsIcon className="w-5 h-5" />,
      description: 'Frequently used settings',
      items: [
        {
          id: 'theme',
          title: 'Theme',
          description: 'Toggle between light and dark mode',
          component: (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </p>
              </div>
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={() => {
                  const newTheme = theme === 'light' ? 'dark' : 'light';
                  // Update document classes
                  const htmlElement = document.documentElement;
                  htmlElement.classList.remove('light', 'dark');
                  htmlElement.classList.add(newTheme);
                  
                  // Set theme in store
                  setTheme(newTheme);
                }}
              />
            </div>
          )
        },
        // Add more quick settings items
      ]
    },
    {
      id: 'account',
      title: 'Account Settings',
      icon: <User className="w-5 h-5" />,
      description: 'Manage your personal information',
      items: [
        {
          id: 'profile',
          title: 'Personal Information',
          description: 'Update your basic information',
          component: (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar || ''} />
                  <AvatarFallback>{user?.first_name?.[0]}{user?.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <Button>Change Avatar</Button>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={user?.first_name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={user?.last_name} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>
            </div>
          )
        },
        // Add more account settings items
      ]
    },
    {
      id: 'business',
      title: 'Business Profile',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Manage your business information',
      items: [
        {
          id: 'business-info',
          title: 'Business Information',
          description: 'Update your business details',
          component: (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Enter business name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input id="businessEmail" type="email" placeholder="business@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input id="registrationNumber" placeholder="Enter registration number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input id="taxNumber" placeholder="Enter tax number" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </div>
          )
        }
      ]
    },
    {
      id: 'professional',
      title: 'Professional Profile',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Manage your professional profile',
      items: [
        {
          id: 'professional-info',
          title: 'Professional Information',
          description: 'Update your professional details',
          component: (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input id="title" placeholder="e.g., Senior Developer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" placeholder="Your main expertise" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input id="hourlyRate" type="number" placeholder="0.00" />
              </div>
              <Button>Save Changes</Button>
            </div>
          )
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <Shield className="w-5 h-5" />,
      description: 'Manage your security settings',
      items: [
        {
          id: 'security-settings',
          title: 'Security Settings',
          description: 'Update your security preferences',
          component: (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-4">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
                <Button>Update Password</Button>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Manage your notification preferences',
      items: [
        {
          id: 'notification-preferences',
          title: 'Notification Preferences',
          description: 'Control your notification settings',
          component: (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          )
        }
      ]
    }
  ];

  // Filter settings based on search query
  const filteredGroups = settingsGroups.filter(group => 
    group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.items.some(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle back navigation
  const handleBack = () => {
    if (activeItem) {
      setActiveItem(null);
    } else if (activeGroup) {
      setActiveGroup(null);
    }
  };

  // Render mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          {!activeGroup ? (
            // Settings Groups List
            <motion.div
              key="groups"
              {...pageTransition}
              className="h-full"
            >
              <div className="sticky top-0 z-10 bg-background p-4 border-b">
                <div className="flex items-center space-x-2 mb-4">
                  <h1 className="text-2xl font-bold">Settings</h1>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search settings..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="p-4 space-y-4">
                  {filteredGroups.map((group) => (
                    <Card
                      key={group.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setActiveGroup(group.id)}
                    >
                      <CardContent className="flex items-center p-4">
                        <div className="flex-1 flex items-center space-x-4">
                          <div className="p-2 bg-primary/10 rounded-full">
                            {group.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{group.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {group.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          ) : (
            // Settings Items List or Item Detail
            <motion.div
              key="items"
              {...pageTransition}
              className="h-full"
            >
              <div className="sticky top-0 z-10 bg-background p-4 border-b">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {settingsGroups.find(g => g.id === activeGroup)?.title}
                  </h2>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="p-4">
                  {activeItem ? (
                    // Render active item component
                    <div className="space-y-4">
                      {settingsGroups
                        .find(g => g.id === activeGroup)
                        ?.items.find(i => i.id === activeItem)
                        ?.component}
                    </div>
                  ) : (
                    // Render items list
                    <div className="space-y-4">
                      {settingsGroups
                        .find(g => g.id === activeGroup)
                        ?.items.map((item) => (
                          <Card
                            key={item.id}
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => setActiveItem(item.id)}
                          >
                            <CardContent className="flex items-center justify-between p-4">
                              <div>
                                <h3 className="font-medium">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="sticky top-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">Settings</h1>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search settings..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeGroup === group.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  {group.icon}
                  <span>{group.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <AnimatePresence mode="wait">
            {activeGroup && (
              <motion.div
                key={activeGroup}
                {...pageTransition}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {settingsGroups.find(g => g.id === activeGroup)?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {settingsGroups
                      .find(g => g.id === activeGroup)
                      ?.items.map((item) => (
                        <div key={item.id} className="mb-8 last:mb-0">
                          <h3 className="text-lg font-semibold mb-4">{item.title}</h3>
                          {item.component}
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;