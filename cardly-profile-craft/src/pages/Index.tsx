
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Share2, Eye, Sparkles, Monitor, Smartphone, Mail, Phone, Globe } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import CardForm from '@/components/CardForm';
import CardPreview from '@/components/CardPreview';
import ShareModal from '@/components/ShareModal';
import ViewCountAnalytics from '@/components/ViewCountAnalytics';
import AICardGenerator from '@/components/AICardGenerator';
import AIServiceTest from '@/components/AIServiceTest';
import ShareButtonTest from '@/components/ShareButtonTest';
import { BusinessCard } from '@/types/types';
import { getCards, saveCard, deleteCard, generateCardId, isValidUUID } from '@/lib/cardUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { isAdmin } from '@/lib/adminUtils';

const Index = () => {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const userIsAdmin = isAdmin(user);
  const [activeTab, setActiveTab] = useState("create");

  // Redirect non-admin users away from admin tabs
  useEffect(() => {
    if (!userIsAdmin && (activeTab === "ai-test" || activeTab === "share-test")) {
      console.log('🔒 Non-admin user attempted to access admin tab:', activeTab);
      setActiveTab("create");
      toast({
        title: "Access Restricted",
        description: "This feature is only available to administrators.",
        variant: "destructive",
      });
    }
  }, [activeTab, userIsAdmin, toast]);
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [currentCard, setCurrentCard] = useState<BusinessCard | undefined>();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("mobile");

  // Create an empty card for the preview when creating a new card
  const [previewCard, setPreviewCard] = useState<BusinessCard>({
    id: generateCardId(),
    name: "Your Name",
    tagline: "Your Tagline",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Load cards from Supabase on component mount and when user changes
  useEffect(() => {
    const fetchCards = async () => {
      if (!user) return;

      try {
        const fetchedCards = await getCards();
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
        toast({
          title: "Error",
          description: "Failed to load your business cards. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchCards();
  }, [toast, user]);

  const handleSaveCard = async (card: BusinessCard) => {
    try {
      // Show loading toast
      toast({
        title: "Saving...",
        description: "Please wait while we save your business card.",
      });

      // Check if the ID might be in the old format (non-UUID)
      const isLikelyOldFormat = card.id && !isValidUUID(card.id);

      if (isLikelyOldFormat) {
        // If it's an old format ID, we'll create a new card instead of updating
        console.log("Converting old format ID to UUID format");

        // Create a new card with the same data but a new ID
        const newCard = {
          ...card,
          id: generateCardId(), // Generate a new UUID
          updatedAt: new Date()
        };

        // Save with the new UUID
        const savedCard = await saveCard(newCard);

        // Update current card with the saved data (which will have the new UUID)
        setCurrentCard(savedCard);
      } else {
        // Normal save with UUID
        const savedCard = await saveCard(card);

        // Update current card with the saved data
        setCurrentCard(savedCard);
      }

      // Update the cards list
      const updatedCards = await getCards();
      setCards(updatedCards);

      // Reset state and navigate to the cards tab
      setIsEditing(false);
      setActiveTab("cards");

      toast({
        title: "Success!",
        description: `Business card ${isEditing ? 'updated' : 'created'} successfully.`,
      });
    } catch (error: any) {
      console.error("Error saving card:", error);

      // Handle specific UUID format errors
      let errorMessage = error.message || "Failed to save the business card. Please try again.";

      if (errorMessage.includes("invalid input syntax for type uuid") || (card.id && !isValidUUID(card.id))) {
        errorMessage = "The card ID format is invalid. Creating a new card instead...";

        try {
          // Create a new card with a valid UUID
          const newCard = {
            ...card,
            id: generateCardId(),
            updatedAt: new Date()
          };

          // Save with the new UUID
          const savedCard = await saveCard(newCard);

          // Update current card with the saved data
          setCurrentCard(savedCard);

          // Update the cards list
          const updatedCards = await getCards();
          setCards(updatedCards);

          // Reset state and navigate to the cards tab
          setIsEditing(false);
          setActiveTab("cards");

          toast({
            title: "Success!",
            description: "Created a new card with your data successfully.",
          });

          // Return early since we've handled the error
          return;
        } catch (retryError: any) {
          // If the retry also fails, show that error
          errorMessage = retryError.message || "Failed to create a new card. Please try again.";
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      // Show loading toast
      toast({
        title: "Deleting...",
        description: "Please wait while we delete your business card.",
      });

      // Check if the ID might be in the old format (non-UUID)
      const isLikelyOldFormat = id && !isValidUUID(id);

      if (isLikelyOldFormat) {
        console.log("Attempting to delete a card with non-UUID format:", id);
      }

      await deleteCard(id);
      const updatedCards = await getCards();
      setCards(updatedCards);

      toast({
        title: "Card Deleted",
        description: "The business card has been deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting card:", error);

      // Handle specific UUID format errors
      let errorMessage = error.message || "Failed to delete the business card. Please try again.";

      if (errorMessage.includes("invalid input syntax for type uuid")) {
        errorMessage = "The card ID format is invalid. Please try refreshing the page and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const startEditing = (card: BusinessCard) => {
    setCurrentCard(card);
    setIsEditing(true);
    setActiveTab("create");
  };

  const viewCard = (card: BusinessCard) => {
    setCurrentCard(card);
    setIsViewMode(true);
  };

  const closeViewMode = () => {
    setIsViewMode(false);
    setCurrentCard(undefined);
  };

  const shareCard = (card: BusinessCard) => {
    setCurrentCard(card);
    setIsShareModalOpen(true);
  };

  // Show loading state with timeout fallback
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-primary mb-4">Loading...</h2>
          <p className="text-slate-600 dark:text-slate-300">Please wait while we load your business cards.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            If this takes too long, check the browser console for errors.
          </p>
        </div>
      </div>
    );
  }

  // Show auth forms if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-3">
              Digital Business Card Creator
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Create, customize, and share professional digital business cards with ease
            </p>
          </header>

          <AuthForm
            mode={authMode}
            onToggleMode={() => setAuthMode(authMode === "signIn" ? "signUp" : "signIn")}
          />
        </div>
      </div>
    );
  }

  // If in view mode, show only the card
  if (isViewMode && currentCard) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <CardPreview card={currentCard} />
        </div>
        <Button
          className="mt-8 bg-white dark:bg-slate-800 text-primary hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm"
          variant="outline"
          onClick={closeViewMode}
        >
          Back to Cards
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-3">
            Digital Business Card Creator
            {userIsAdmin && (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Admin
              </span>
            )}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Create, customize, and share professional digital business cards with ease
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl mx-auto">
          <TabsList className={`grid w-full ${userIsAdmin ? 'grid-cols-5' : 'grid-cols-3'} mb-10 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
            <TabsTrigger value="create" className="text-base font-medium py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
              {isEditing ? "Edit Card" : "Create Card"}
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="text-base font-medium py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Sparkles className="mr-1 h-4 w-4" /> AI Generator
            </TabsTrigger>
            {userIsAdmin && (
              <TabsTrigger value="ai-test" className="text-base font-medium py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                AI Test
              </TabsTrigger>
            )}
            {userIsAdmin && (
              <TabsTrigger value="share-test" className="text-base font-medium py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                Share Test
              </TabsTrigger>
            )}
            <TabsTrigger value="cards" className="text-base font-medium py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
              Your Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-montserrat text-slate-900 dark:text-white">
                  {isEditing ? "Edit Your Business Card" : "Create a New Business Card"}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">
                  Fill in your details to {isEditing ? "update your" : "create a"} professional digital business card.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <CardForm
                      initialData={currentCard}
                      onSubmit={handleSaveCard}
                      onCancel={() => {
                        setIsEditing(false);
                        setCurrentCard(undefined);
                      }}
                      onFormChange={(formData) => {
                        // Update preview card with form data
                        setPreviewCard({
                          ...previewCard,
                          ...formData,
                          updatedAt: new Date()
                        });
                      }}
                    />
                  </div>

                  <div className="hidden md:block">
                    <div className="space-y-4">
                      {/* Luxury Preview Header */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              Live Preview
                            </h3>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          </div>

                          {/* Clean Device Switcher */}
                          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1" role="tablist" aria-label="Preview mode selector">
                            <button
                              onClick={() => setPreviewMode("mobile")}
                              role="tab"
                              aria-selected={previewMode === "mobile"}
                              aria-label="Switch to mobile preview"
                              title="View mobile preview"
                              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                previewMode === "mobile"
                                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                              }`}
                            >
                              <Smartphone className="w-4 h-4 mr-2" aria-hidden="true" />
                              Mobile
                            </button>
                            <button
                              onClick={() => setPreviewMode("desktop")}
                              role="tab"
                              aria-selected={previewMode === "desktop"}
                              aria-label="Switch to desktop preview"
                              title="View desktop preview"
                              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                previewMode === "desktop"
                                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                              }`}
                            >
                              <Monitor className="w-4 h-4 mr-2" aria-hidden="true" />
                              Desktop
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Preview Container with Device Frame */}
                      <div className="flex justify-center">
                        <div className={`relative transition-all duration-300 ${
                          previewMode === "mobile"
                            ? "w-full max-w-md"
                            : "w-full max-w-[480px]"
                        }`}>
                          {/* Mobile Device Frame */}
                          {previewMode === "mobile" ? (
                            <div className="relative mx-auto" style={{ width: "300px", height: "600px" }}>
                              {/* Phone Frame */}
                              <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] shadow-2xl">
                                {/* Screen Area */}
                                <div className="absolute inset-4 bg-black rounded-[1.8rem] overflow-hidden">
                                  {/* Status Bar */}
                                  <div className="absolute top-0 left-0 right-0 h-10 bg-black z-20 flex items-center justify-between px-6">
                                    <div className="flex items-center space-x-1">
                                      <div className="text-white text-sm font-medium">9:41</div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <div className="w-4 h-2 bg-white rounded-sm opacity-60"></div>
                                      <div className="w-1 h-2 bg-white rounded-sm opacity-60"></div>
                                      <div className="w-6 h-3 border border-white rounded-sm opacity-60 relative">
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-r-sm"></div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card Content Area */}
                                  <div className="absolute top-10 left-0 right-0 bottom-8 bg-white overflow-hidden">
                                    <div className="h-full overflow-y-auto scrollbar-hide">
                                      <div className="w-full">
                                        <div className="transform scale-[1.1] origin-top -mt-2 w-full">
                                          {isEditing ? (
                                            <CardPreview card={currentCard || previewCard} />
                                          ) : (
                                            <CardPreview card={previewCard} />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Home Indicator */}
                                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
                                </div>

                                {/* Phone Details */}
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-slate-700 rounded-full"></div>
                                <div className="absolute top-8 right-8 w-2 h-2 bg-slate-700 rounded-full"></div>
                              </div>
                            </div>
                          ) : (
                            /* Desktop Frame */
                            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                              {/* Browser Header */}
                              <div className="flex items-center space-x-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="flex-1 bg-white dark:bg-slate-700 rounded h-6 ml-4 flex items-center px-3">
                                  <span className="text-xs text-slate-500 dark:text-slate-400">cardly.app/@your-card</span>
                                </div>
                              </div>

                              {/* Desktop Content */}
                              <div className="p-8">
                                {isEditing ? (
                                  <CardPreview card={currentCard || previewCard} />
                                ) : (
                                  <CardPreview card={previewCard} />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Clean Preview Mode Label */}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                              {previewMode === "mobile" ? "📱 Mobile View" : "🖥️ Desktop View"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Preview Section */}
                  <div className="md:hidden mt-8">
                    <div className="space-y-4">
                      {/* Mobile Preview Header */}
                      <div className="flex items-center justify-center">
                        <h3 className="text-lg font-semibold text-primary">📱 Mobile Preview</h3>
                      </div>

                      {/* Mobile Preview Container */}
                      <div className="flex justify-center">
                        <div className="relative" style={{ width: "200px", height: "400px" }}>
                          {/* Phone Frame */}
                          <div className="absolute inset-0 bg-slate-900 rounded-[2rem] shadow-2xl">
                            {/* Screen Area */}
                            <div className="absolute inset-2 bg-black rounded-[1.3rem] overflow-hidden">
                              {/* Status Bar */}
                              <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20 flex items-center justify-between px-3">
                                <div className="text-white text-xs font-medium">9:41</div>
                                <div className="flex items-center space-x-1">
                                  <div className="w-3 h-1.5 bg-white rounded-sm opacity-60"></div>
                                  <div className="w-4 h-2 border border-white rounded-sm opacity-60"></div>
                                </div>
                              </div>

                              {/* Card Content Area */}
                              <div className="absolute top-6 left-0 right-0 bottom-4 bg-white overflow-hidden">
                                <div className="h-full overflow-y-auto scrollbar-hide">
                                  <div className="w-full">
                                    <div className="transform scale-[0.8] origin-top -mt-4 w-full">
                                      {isEditing ? (
                                        <CardPreview card={currentCard || previewCard} />
                                      ) : (
                                        <CardPreview card={previewCard} />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Home Indicator */}
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-white rounded-full opacity-60"></div>
                            </div>

                            {/* Phone Details */}
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-slate-700 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-generator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <AICardGenerator
                onGenerate={(generatedCard) => {
                  try {
                    console.log("Received generated card:", generatedCard);

                    // Make sure we have a valid card with required fields
                    if (!generatedCard || !generatedCard.name || !generatedCard.tagline) {
                      throw new Error("Generated card is missing required fields");
                    }

                    // Set the current card and update UI state
                    setCurrentCard(generatedCard);
                    setIsEditing(true);
                    setActiveTab("create");

                    // Update preview card with the generated data
                    setPreviewCard({
                      ...previewCard,
                      ...generatedCard,
                      updatedAt: new Date()
                    });

                    toast({
                      title: "Card Generated!",
                      description: "Now you can customize your AI-generated card.",
                    });
                  } catch (error) {
                    console.error("Error handling generated card:", error);
                    toast({
                      title: "Generation Error",
                      description: "There was a problem with the generated card. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              />

              <div className="hidden md:flex flex-col space-y-6">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium rounded-xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl font-montserrat text-slate-900 dark:text-white">
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4 list-decimal list-inside text-slate-700 dark:text-slate-300">
                      <li>Describe your business in detail and select your industry</li>
                      <li>Include contact information in your description for better results</li>
                      <li>Our AI will generate a professional business card with your details</li>
                      <li>Customize the generated card and save it to your collection</li>
                      <li>Share your unique business card with others</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium rounded-xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl font-montserrat text-slate-900 dark:text-white">
                      Tips for Better Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 list-disc list-inside text-slate-700 dark:text-slate-300">
                      <li>Include your business name in quotes (e.g., "Acme Inc.")</li>
                      <li>Add contact details like email and phone number</li>
                      <li>Include your website if you have one</li>
                      <li>Mention your specific services or products</li>
                      <li>Select the most relevant industry category</li>
                      <li>Be specific about your business focus and unique selling points</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {userIsAdmin && (
            <TabsContent value="ai-test" className="space-y-6">
              <AIServiceTest />
            </TabsContent>
          )}

          {userIsAdmin && (
            <TabsContent value="share-test" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <ShareButtonTest />
              </div>
            </TabsContent>
          )}

          <TabsContent value="cards">
            {cards.length > 0 ? (
              <div className="space-y-8">
                {/* Premium Analytics Access */}
                <div className="bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 rounded-3xl border border-slate-200/30 dark:border-slate-700/30 p-8 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-light text-slate-900 dark:text-white">Analytics Dashboard</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">View detailed insights and performance metrics</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-light text-slate-900 dark:text-white">2,847</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-light text-slate-900 dark:text-white">{cards.length}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Cards</p>
                      </div>
                      <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>

                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={() => setActiveTab("create")}
                          className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-100 dark:hover:to-slate-200 font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Card
                        </Button>

                        <Button
                          onClick={() => {
                            // TODO: Navigate to analytics dashboard
                            console.log('Navigate to analytics dashboard');
                          }}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ultra Premium Cards Gallery */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-extralight text-slate-900 dark:text-white tracking-tight">Gallery</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sort by</span>
                      <select
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                        aria-label="Sort cards by"
                      >
                        <option value="recent">Recent</option>
                        <option value="name">Name</option>
                        <option value="views">Views</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                      <div key={card.id} className="group relative">
                        {/* Premium Simplified Card Container */}
                        <div className="relative bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-700/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-xl group-hover:scale-[1.02] transform">

                          {/* Luxury Background Pattern */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.03),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.08),transparent_70%)] transition-all duration-500"></div>

                          {/* Premium Card Content */}
                          <div className="relative p-6">
                            {/* Company Name and Status */}
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-2xl font-medium text-slate-900 dark:text-white tracking-tight truncate pr-4">
                                {card.name}
                              </h3>

                              {/* Active Status Badge */}
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/30"></div>
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 tracking-wide">ACTIVE</span>
                              </div>
                            </div>

                            {/* Premium Action Buttons */}
                            <div className="space-y-3">
                              {/* Primary Actions Row */}
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => viewCard(card)}
                                  className="flex-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl py-2.5 font-medium transition-all duration-200"
                                >
                                  <Eye size={16} className="mr-2" />
                                  Preview
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(card)}
                                  className="flex-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl py-2.5 font-medium transition-all duration-200"
                                >
                                  <Edit size={16} className="mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => shareCard(card)}
                                  className="flex-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl py-2.5 font-medium transition-all duration-200"
                                >
                                  <Share2 size={16} className="mr-2" />
                                  Share
                                </Button>
                              </div>

                              {/* Secondary Actions Row */}
                              <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/30 dark:border-slate-700/30">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // TODO: Implement deactivate functionality
                                    console.log('Deactivate card:', card.id);
                                  }}
                                  className="flex-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl py-2.5 font-medium transition-all duration-200"
                                >
                                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                  Deactivate
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl py-2.5 font-medium transition-all duration-200"
                                    >
                                      <Trash2 size={16} className="mr-2" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium rounded-xl">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-slate-900 dark:text-white">Delete Business Card</AlertDialogTitle>
                                      <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                                        Are you sure you want to delete "{card.name}"? This action cannot be undone and will permanently remove the card from your collection.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                        onClick={() => handleDeleteCard(card.id)}
                                      >
                                        Delete Card
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden">
                {/* Premium Empty State Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_70%)]"></div>

                <div className="relative text-center py-24 px-12 border border-slate-200/30 dark:border-slate-700/30 rounded-3xl backdrop-blur-xl">
                  <div className="space-y-8">
                    {/* Premium Icon */}
                    <div className="relative mx-auto w-24 h-24">
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center shadow-2xl">
                        <PlusCircle className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl blur-xl opacity-50"></div>
                    </div>

                    {/* Premium Typography */}
                    <div className="space-y-4">
                      <h3 className="text-4xl font-extralight text-slate-900 dark:text-white tracking-tight">
                        Begin Your Journey
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xl font-light max-w-lg mx-auto leading-relaxed">
                        Create your first premium digital business card and start building your professional portfolio.
                      </p>
                    </div>

                    {/* Premium CTA */}
                    <div className="pt-4">
                      <Button
                        onClick={() => setActiveTab("create")}
                        className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-100 dark:hover:to-slate-200 font-medium px-10 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                      >
                        <PlusCircle className="mr-3 h-6 w-6" />
                        Create Your First Card
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {currentCard && (
          <ShareModal
            card={currentCard}
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
