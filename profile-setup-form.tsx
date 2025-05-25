import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // For contact_info
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../AuthContext"; // Adjust path if needed
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import { UploadCloudIcon, XIcon } from "lucide-react";

const profileFormSchema = z.object({
  business_name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  contact_info: z.string().optional(),
  // Add website here if you re-add it to the profiles table and backend API
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Initialize Supabase client for storage
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseStorage: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabaseStorage = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error("Supabase URL or Anon Key is missing for frontend. File uploads will not work.");
  // No toast here as it might be too early (component not mounted)
}

interface ProfileSetupFormProps {
  onComplete?: () => void; // Make onComplete optional or handle it if needed
}

export default function ProfileSetupForm({ onComplete }: ProfileSetupFormProps) {
  const { user, token, setUser: setAuthUser, isLoading: authIsLoading } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      business_name: "",
      contact_info: "",
    },
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null); // Store the existing logo URL
  const [isFormLoading, setIsFormLoading] = useState(false); // Local loading state for form operations

  useEffect(() => {
    if (!supabaseStorage) {
        toast.warning("File upload service is not configured. Logo operations will be disabled.");
    }
    if (user && token) {
      setIsFormLoading(true);
      fetch(`${API_BASE_URL}/profile`, {
        headers: { 'x-user-id': user.id, 'Authorization': `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 404) return null; // Profile might not exist yet
        if (!res.ok) throw new Error("Failed to fetch profile data.");
        return res.json();
      })
      .then(data => {
        if (data) {
          form.reset({
            business_name: data.business_name || "",
            contact_info: data.contact_info || "",
          });
          if (data.logo_url) {
            setLogoPreview(data.logo_url);
            setCurrentLogoUrl(data.logo_url);
          }
        }
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        toast.error(error.message || "Could not load your profile data.");
      })
      .finally(() => setIsFormLoading(false));
    }
  }, [user, token, form, API_BASE_URL]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Logo size should not exceed 2MB.");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setCurrentLogoUrl(null); // New file selected, old URL is no longer the "current" one for submission
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null); 
    // Keep currentLogoUrl as is, so if they save without new logo, it's effectively removed if currentLogoUrl was set.
    // Or, if user wants to remove existing logo and save that change:
    // setCurrentLogoUrl(null); // This would signal to remove the logo on backend by sending null for logo_url
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!user || !token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
    if (!supabaseStorage && logoFile) { // Only error if trying to upload new logo when storage not configured
      toast.error("File upload service is not available. Cannot upload new logo.");
      return;
    }

    setIsFormLoading(true);
    let uploadedLogoUrl = currentLogoUrl; // Default to existing logo URL

    try {
      if (logoFile) { // A new logo was selected
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}_logo_${Date.now()}.${fileExt}`; // Unique filename
        const filePath = `public/${fileName}`; // Bucket: profile-logos (public access assumed)

        const { data: uploadData, error: uploadError } = await supabaseStorage!.storage // Assert non-null due to check above
          .from('profile-logos') // Make sure this bucket exists with public read access and appropriate upload policies
          .upload(filePath, logoFile, {
            cacheControl: '3600',
            upsert: true, // Overwrite if user uploads new logo with same generated name (unlikely due to timestamp)
          });

        if (uploadError) {
          throw new Error(`Logo upload failed: ${uploadError.message}`);
        }
        
        const { data: publicUrlData } = supabaseStorage!.storage
          .from('profile-logos')
          .getPublicUrl(filePath);
        
        if (!publicUrlData || !publicUrlData.publicUrl) {
            throw new Error("Could not get public URL for the uploaded logo.");
        }
        uploadedLogoUrl = publicUrlData.publicUrl;
      } else if (logoPreview === null && currentLogoUrl !== null) {
        // This means the logo was displayed (from currentLogoUrl) and then removed by user clicking 'X'
        // and no new file was chosen. Send null to backend to signify removal.
        uploadedLogoUrl = null;
      }
      // If logoPreview is not null, but logoFile is null, it means currentLogoUrl is being displayed and unchanged.
      // uploadedLogoUrl would have been initialized to currentLogoUrl.

      const profilePayload = {
        ...data,
        logo_url: uploadedLogoUrl,
      };

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id, // Using x-user-id as per backend middleware
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profilePayload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile.");
      }

      toast.success("Profile Updated Successfully!");
      if (result.profile) {
        setCurrentLogoUrl(result.profile.logo_url); // Update with potentially new or removed URL
        setLogoFile(null); // Clear selected file post-submit
        // Update AuthContext if profile data is stored there beyond basic user info
        // Example: if (setAuthUser && user) setAuthUser({ ...user, business_name: result.profile.business_name, logo_url: result.profile.logo_url });
        // For now, AuthContext.User is minimal, so no direct update needed unless it's expanded.
      }
      if (onComplete) onComplete();
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsFormLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Your Business LLC" {...field} />
              </FormControl>
              <FormDescription>
                Your official business or trading name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Info (Optional)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="e.g., Public email, phone number, or address." {...field} />
              </FormControl>
              <FormDescription>
                Public contact information for your clients.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Logo (Optional)</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-orange-500 transition-colors dark:border-gray-700 dark:hover:border-orange-400">
            {logoPreview ? (
              <div className="relative w-full">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-32 mx-auto object-contain rounded-md bg-gray-50 dark:bg-gray-800"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 p-0 rounded-full bg-black/20 hover:bg-black/40 text-white"
                  onClick={removeLogo}
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Remove logo</span>
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => document.getElementById("logo-upload-input")?.click()}
              >
                <UploadCloudIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload your logo</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max. 2MB)</p>
              </div>
            )}
            <Input
              id="logo-upload-input"
              type="file"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isFormLoading || authIsLoading || (!supabaseStorage && !!logoFile)}>
            {isFormLoading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
        {!supabaseStorage && <p className="text-xs text-red-600 mt-1 text-right">Logo upload service unavailable.</p>}
      </form>
    </Form>
  );
}
