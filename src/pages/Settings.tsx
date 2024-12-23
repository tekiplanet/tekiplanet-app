import React, { useState, useEffect, useRef } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

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

const accountFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const businessFormSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  business_email: z.string().email("Invalid business email"),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  registration_number: z.string().optional(),
  tax_number: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal('')),
  description: z.string().max(500, "Description must be less than 500 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

const professionalFormSchema = z.object({
  title: z.string().min(2, "Professional title must be at least 2 characters"),
  specialization: z.string().min(2, "Specialization must be at least 2 characters"),
  expertise_areas: z.array(z.string()).min(1, "Select at least one area of expertise"),
  years_of_experience: z.number().min(0, "Years of experience cannot be negative"),
  hourly_rate: z.number().min(0, "Hourly rate cannot be negative"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  certifications: z.array(z.string()).optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
  github_url: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  portfolio_url: z.string().url("Invalid Portfolio URL").optional().or(z.literal('')),
  preferred_contact_method: z.enum(['email', 'phone', 'platform']),
  timezone: z.string().min(1, "Timezone is required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
});

const securityFormSchema = z.object({
  current_password: z.string().min(8, "Password must be at least 8 characters"),
  new_password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

const notificationsFormSchema = z.object({
  email_notifications: z.boolean(),
  push_notifications: z.boolean(),
  marketing_notifications: z.boolean(),
  profile_visibility: z.enum(['public', 'private', 'friends']),
  data_collection: z.boolean(),
});

const AccountSettingsForm = () => {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Get the full avatar URL
  const avatarUrl = user?.avatar || null;
  
  console.log('Avatar details:', {
    userObject: user,
    avatarUrl: avatarUrl,
    baseUrl: import.meta.env.VITE_API_URL,
    fullUrl: avatarUrl
  });

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof accountFormSchema>) => {
    const loadingToast = toast.loading('Updating your profile...');

    try {
      const response = await apiClient.put('/settings/profile', values);
      await updateUser(response.data.user);

      toast.dismiss(loadingToast);
      toast.success('Your profile has been updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      toast.dismiss(loadingToast);
      
      // Show the first validation error message if it exists
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        // Fallback to the general error message
        toast.error(
          error.response?.data?.message || 
          'Unable to update your profile. Please try again.'
        );
      }
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or JPG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast.error('Image size should not exceed 2MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    const loadingToast = toast.loading('Uploading avatar...');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post('/settings/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Avatar update response:', response.data);
      
      await updateUser(response.data.user);
      
      console.log('User after update:', user);

      toast.dismiss(loadingToast);
      toast.success('Avatar updated successfully');
    } catch (error: any) {
      console.error('Avatar update error:', error);
      toast.dismiss(loadingToast);
      toast.error(
        error.response?.data?.message || 
        'Failed to update avatar. Please try again.'
      );
      // Reset preview on error
      setPreviewUrl(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={previewUrl || avatarUrl || ''} 
              alt={`${user?.first_name} ${user?.last_name}`}
              onError={(e) => {
                console.error('Avatar image failed to load:', e);
                const img = e.target as HTMLImageElement;
                console.log('Failed URL:', img.src);
                // Try to fetch the URL directly to see the response
                fetch(img.src)
                  .then(response => {
                    console.log('Avatar fetch response:', {
                      status: response.status,
                      statusText: response.statusText,
                      headers: Object.fromEntries(response.headers),
                      url: response.url
                    });
                  })
                  .catch(error => {
                    console.error('Avatar fetch error:', error);
                  });
              }}
            />
            <AvatarFallback>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleAvatarChange}
            />
            <div className="flex flex-col gap-2">
              <Button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Avatar
              </Button>
              {avatarUrl && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setPreviewUrl(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              JPG, PNG. Maximum size 2MB.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Username</Label>
            <Input 
              value={user?.username || ''} 
              disabled 
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Username cannot be changed
            </p>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

const BusinessProfileForm = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const businessProfile = user?.business_profile;

  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      business_name: businessProfile?.business_name || "",
      business_email: businessProfile?.business_email || "",
      phone_number: businessProfile?.phone_number || "",
      registration_number: businessProfile?.registration_number || "",
      tax_number: businessProfile?.tax_number || "",
      website: businessProfile?.website || "",
      description: businessProfile?.description || "",
      address: businessProfile?.address || "",
      city: businessProfile?.city || "",
      state: businessProfile?.state || "",
      country: businessProfile?.country || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof businessFormSchema>) => {
    try {
      await updateUser({ business_profile: values });
      toast({
        title: "Business profile updated",
        description: "Your business information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="registration_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tax_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} type="url" placeholder="https://" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

const ProfessionalProfileForm = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const professionalProfile = user?.professional;

  const form = useForm<z.infer<typeof professionalFormSchema>>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      title: professionalProfile?.title || "",
      specialization: professionalProfile?.specialization || "",
      expertise_areas: professionalProfile?.expertise_areas || [],
      years_of_experience: professionalProfile?.years_of_experience || 0,
      hourly_rate: professionalProfile?.hourly_rate || 0,
      bio: professionalProfile?.bio || "",
      certifications: professionalProfile?.certifications || [],
      linkedin_url: professionalProfile?.linkedin_url || "",
      github_url: professionalProfile?.github_url || "",
      portfolio_url: professionalProfile?.portfolio_url || "",
      preferred_contact_method: professionalProfile?.preferred_contact_method || 'email',
      timezone: professionalProfile?.timezone || "",
      languages: professionalProfile?.languages || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof professionalFormSchema>) => {
    try {
      await updateUser({ professional: values });
      toast({
        title: "Professional profile updated",
        description: "Your professional information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update professional profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Senior Developer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Full Stack Development" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Experience and Rate */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="years_of_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Bio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Tell us about your professional journey" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Professional Links */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://linkedin.com/in/..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://github.com/..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="portfolio_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Website</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Preference */}
          <FormField
            control={form.control}
            name="preferred_contact_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Contact Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="platform">Platform Messages</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

const SecuritySettingsForm = () => {
  const form = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof securityFormSchema>) => {
    const loadingToast = toast.loading('Updating password...');

    try {
      await apiClient.put('/settings/password', {
        current_password: values.current_password,
        new_password: values.new_password,
        confirm_password: values.confirm_password
      });

      toast.dismiss(loadingToast);
      toast.success('Password updated successfully');
      form.reset();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Form>
  );
};

const NotificationsForm = () => {
  const { user, updatePreferences } = useAuthStore();
  const form = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      email_notifications: user?.email_notifications || false,
      push_notifications: user?.push_notifications || false,
      marketing_notifications: user?.marketing_notifications || false,
      profile_visibility: user?.profile_visibility || 'private',
      data_collection: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof notificationsFormSchema>) => {
    const loadingToast = toast.loading('Updating notification preferences...');

    try {
      await updatePreferences(values);
      toast.dismiss(loadingToast);
      toast.success('Notification preferences updated successfully');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to update notification preferences');
    }
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email_notifications"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about important updates
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="push_notifications"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on your devices
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="marketing_notifications"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="profile_visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Visibility</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useAuthStore();

  const handleThemeChange = async (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    const loadingToast = toast.loading(`Switching to ${newTheme} mode...`);

    try {
      await setTheme(newTheme);
      toast.dismiss(loadingToast);
      toast.success(`Theme changed to ${newTheme} mode`);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to update theme');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label className="text-base">Dark Mode</Label>
        <p className="text-sm text-muted-foreground">
          {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
        </p>
      </div>
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={handleThemeChange}
      />
    </div>
  );
};

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
          component: <ThemeToggle />
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
          component: <AccountSettingsForm />
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
          component: <BusinessProfileForm />
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
          component: <ProfessionalProfileForm />
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
          id: 'password',
          title: 'Password',
          description: 'Change your password',
          component: <SecuritySettingsForm />
        },
        {
          id: 'two-factor',
          title: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          component: (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Protect your account with 2FA
                </p>
              </div>
              <Switch 
                checked={false}
                onCheckedChange={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon.",
                  });
                }}
              />
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
          component: <NotificationsForm />
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