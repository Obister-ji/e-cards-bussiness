import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BusinessCardFormData, BusinessCard } from "@/types/types";
import { generateCardId, isValidUUID, getCards } from "@/lib/cardUtils";
import { useToast } from "@/components/ui/use-toast";
import ThemeSelector from "@/components/ThemeSelector";
import ExclusiveBadge, { BadgeType } from "@/components/ExclusiveBadge";
import { UrlInput } from "@/components/UrlInput";

import SimpleImageUpload from "@/components/SimpleImageUpload";

interface CardFormProps {
  initialData?: BusinessCard;
  onSubmit: (card: BusinessCard) => void;
  onCancel?: () => void;
  onFormChange?: (formData: Partial<BusinessCard>) => void;
}

const CardForm: React.FC<CardFormProps> = ({ initialData, onSubmit, onCancel, onFormChange }) => {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(initialData?.logo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [existingCards, setExistingCards] = useState<BusinessCard[]>([]);
  const [cardUrl, setCardUrl] = useState<string>(initialData?.cardUrl || "");

  // Load existing cards for URL validation
  useEffect(() => {
    const loadExistingCards = async () => {
      try {
        const cards = await getCards();
        setExistingCards(cards);
      } catch (error) {
        console.error('Error loading existing cards:', error);
      }
    };
    loadExistingCards();
  }, []);

  // Create form default values that match BusinessCardFormData type
  const defaultValues: Omit<BusinessCardFormData, 'logo'> = {
    name: initialData?.name || "",
    tagline: initialData?.tagline || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    instagram: initialData?.instagram || "",
    whatsapp: initialData?.whatsapp || "",
    description: initialData?.description || "",
    theme: initialData?.theme || "minimalist-black-gold", // Default theme
    badge: initialData?.badge || "none", // Default badge
    cardUrl: initialData?.cardUrl || "",
  };

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BusinessCardFormData>({
    defaultValues: defaultValues,
    mode: "onChange",
    criteriaMode: "all",
    shouldFocusError: true
  });

  // Watch form values for real-time preview
  const formValues = watch();

  // Update preview when form values change
  React.useEffect(() => {
    if (onFormChange) {
      onFormChange({
        name: formValues.name,
        tagline: formValues.tagline,
        email: formValues.email,
        phone: formValues.phone,
        website: formValues.website,
        instagram: formValues.instagram,
        whatsapp: formValues.whatsapp,
        description: formValues.description,
        theme: formValues.theme,
        badge: formValues.badge,
        cardUrl: cardUrl,
        logo: logoPreview
      });
    }
  }, [formValues, logoPreview, cardUrl, onFormChange]);





  const processSubmit = async (data: BusinessCardFormData) => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!data.name || !data.tagline) {
        throw new Error("Business name and tagline are required");
      }

      let logoUrl = logoPreview;

      // The logo is already processed by AnimatedProfileUpload component
      // logoUrl already contains the processed data URL from logoPreview
      // No need to process data.logo as it's handled by the upload component

      // Check if we have a valid UUID, otherwise generate a new one
      const cardId = initialData?.id && isValidUUID(initialData.id)
        ? initialData.id
        : generateCardId();

      // Create the card object with proper validation
      const card: BusinessCard = {
        id: cardId,
        name: data.name.trim(),
        tagline: data.tagline.trim(),
        logo: logoUrl,
        email: data.email ? data.email.trim() : undefined,
        phone: data.phone ? data.phone.trim() : undefined,
        website: data.website ? data.website.trim() : undefined,
        instagram: data.instagram ? data.instagram.trim() : undefined,
        whatsapp: data.whatsapp ? data.whatsapp.trim() : undefined,
        description: data.description ? data.description.trim() : undefined,
        theme: data.theme || "minimalist-black-gold", // Include theme with default fallback
        badge: data.badge !== "none" ? data.badge : undefined, // Include badge if not "none"
        cardUrl: cardUrl ? cardUrl.trim() : undefined, // Include the beautiful URL
        animations: [], // Will be populated based on theme
        effects: [], // Will be populated based on theme
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      // Submit the card
      onSubmit(card);
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger
            value="details"
            className="text-sm font-medium py-3 px-4 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
          >
            Card Details
          </TabsTrigger>
          <TabsTrigger
            value="logo"
            className="text-sm font-medium py-3 px-4 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
          >
            Profile Picture
          </TabsTrigger>
          <TabsTrigger
            value="themes"
            className="text-sm font-medium py-3 px-4 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
          >
            Themes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">

          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Business Name *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: "Business name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
                maxLength: { value: 100, message: "Name must be less than 100 characters" }
              })}
              placeholder="Enter your business name"
              className="h-12 text-base border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline *</Label>
            <Input
              id="tagline"
              {...register("tagline", {
                required: "Tagline is required",
                minLength: { value: 2, message: "Tagline must be at least 2 characters" },
                maxLength: { value: 150, message: "Tagline must be less than 150 characters" }
              })}
              placeholder="e.g., Premium Adhesive Solutions"
            />
            {errors.tagline && (
              <p className="text-sm text-destructive">{errors.tagline.message}</p>
            )}
          </div>

          {/* Beautiful URL Input */}
          <UrlInput
            companyName={formValues.name || ""}
            value={cardUrl}
            onChange={setCardUrl}
            existingCards={existingCards}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-md px-3 py-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">+91</span>
                </div>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="9876543210"
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="flex">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-md px-3 py-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">https://</span>
                </div>
                <Input
                  id="website"
                  {...register("website", {
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                      message: "Invalid website URL"
                    }
                  })}
                  placeholder="yourwebsite.com"
                  className="rounded-l-none"
                />
              </div>
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="flex">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-md px-3 py-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">@</span>
                </div>
                <Input
                  id="instagram"
                  {...register("instagram")}
                  placeholder="username"
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <div className="flex">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-md px-3 py-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">+91</span>
              </div>
              <Input
                id="whatsapp"
                {...register("whatsapp")}
                placeholder="9876543210"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of your business"
              className="min-h-24"
            />
          </div>
        </TabsContent>

        <TabsContent value="logo" className="space-y-6">
          <SimpleImageUpload
            onImageUpload={(imageUrl) => {
              console.log('🖼️ Image uploaded in CardForm:', imageUrl.substring(0, 50) + '...');
              setLogoPreview(imageUrl);
              // Update preview with new profile picture
              if (onFormChange) {
                onFormChange({
                  ...formValues,
                  logo: imageUrl
                });
              }
            }}
            currentImage={logoPreview}
            className="max-w-2xl mx-auto"
          />

          {/* Hidden input for form compatibility */}
          <input
            type="hidden"
            {...register("logo")}
            value={logoPreview || ''}
          />
        </TabsContent>

        <TabsContent value="themes" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Select a Premium Theme</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("details")}
              >
                Back to Details
              </Button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Choose from our collection of premium themes to make your business card stand out.
            </p>

            <input
              type="hidden"
              {...register("theme")}
            />

            <ThemeSelector
              selectedTheme={formValues.theme || "minimalist-black-gold"}
              onSelectTheme={(themeId) => {
                // This will update the hidden input value
                const event = {
                  target: { name: "theme", value: themeId }
                } as React.ChangeEvent<HTMLInputElement>;
                register("theme").onChange(event);
              }}
            />

            <div className="mt-10 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add an Exclusive Badge</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Enhance your card with a premium badge to showcase your status.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                  <RadioGroup
                    defaultValue={formValues.badge || "none"}
                    onValueChange={(value) => {
                      const event = {
                        target: { name: "badge", value }
                      } as React.ChangeEvent<HTMLInputElement>;
                      register("badge").onChange(event);
                    }}
                  >
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                      <RadioGroupItem value="none" id="badge-none" />
                      <Label htmlFor="badge-none" className="cursor-pointer">No Badge</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                      <RadioGroupItem value="vip" id="badge-vip" />
                      <Label htmlFor="badge-vip" className="cursor-pointer flex items-center">
                        <ExclusiveBadge type="vip" className="ml-2" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                      <RadioGroupItem value="verified" id="badge-verified" />
                      <Label htmlFor="badge-verified" className="cursor-pointer flex items-center">
                        <ExclusiveBadge type="verified" className="ml-2" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                      <RadioGroupItem value="premium" id="badge-premium" />
                      <Label htmlFor="badge-premium" className="cursor-pointer flex items-center">
                        <ExclusiveBadge type="premium" className="ml-2" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                      <RadioGroupItem value="elite" id="badge-elite" />
                      <Label htmlFor="badge-elite" className="cursor-pointer flex items-center">
                        <ExclusiveBadge type="elite" className="ml-2" />
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Badge Preview</h4>
                  <div className="flex items-center justify-center h-20 bg-white dark:bg-slate-900 rounded-md">
                    {formValues.badge && formValues.badge !== "none" ? (
                      <ExclusiveBadge type={formValues.badge as BadgeType} className="transform scale-150" />
                    ) : (
                      <p className="text-sm text-slate-500">No badge selected</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Badges add a premium touch to your business card and help establish credibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {initialData ? 'Update Card' : 'Create Card'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CardForm;
