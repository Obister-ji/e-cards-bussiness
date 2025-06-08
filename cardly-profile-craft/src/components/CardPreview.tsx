
import React, { useState, useEffect } from "react";
import { BusinessCard } from "@/types/types";
import { downloadVCard } from "@/lib/cardUtils";
import ShareModal from "@/components/ShareModal";
import {
  Share2,
  Mail,
  Instagram,
  MessageSquare,
  Globe,
  Phone,
  ContactRound,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PREMIUM_THEMES, ThemeStyle } from "@/components/ThemeSelector";
import ExclusiveBadge, { BadgeType } from "@/components/ExclusiveBadge";

interface CardPreviewProps {
  card: BusinessCard;
  className?: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({ card, className }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();
  const [isAnimated, setIsAnimated] = useState(false);

  // Get the selected theme or use default
  const getThemeStyles = (): ThemeStyle => {
    const themeId = card.theme || "minimalist-black-gold";
    return PREMIUM_THEMES.find(theme => theme.id === themeId) || PREMIUM_THEMES[0];
  };

  const themeStyles = getThemeStyles();

  // Get animation and effect classes based on theme
  const getAnimationClasses = (): string => {
    if (!themeStyles.animations || themeStyles.animations.length === 0) return '';
    return themeStyles.animations.join(' ');
  };

  const getEffectClasses = (): string => {
    if (!themeStyles.effects || themeStyles.effects.length === 0) return '';
    return themeStyles.effects.join(' ');
  };

  const animationClasses = getAnimationClasses();
  const effectClasses = getEffectClasses();

  useEffect(() => {
    // Add animation after component is mounted
    setIsAnimated(true);
  }, []);

  const handleShare = () => {
    console.log('🔄 Share button clicked in CardPreview');
    setShowShareModal(true);
  };

  const handleDownloadVCard = () => {
    try {
      downloadVCard(card);
      toast({
        title: "Contact Saved",
        description: "VCard file downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download vCard. Please try again.",
        variant: "destructive",
      });
    }
  };



  return (
    <>
    <div className={`business-card premium-card ${isAnimated ? 'animate-fade-in' : ''} ${className} ${themeStyles.previewClass} ${animationClasses} ${effectClasses}`}>
      {/* Enhanced Share Button with Dropdown */}
      <div className="absolute top-4 right-4 z-30">
        <div
          id="shareBtn"
          className="w-10 h-10 rounded-full flex justify-center items-center border-2 cursor-pointer hover:scale-110 transition-all duration-300 bg-black/80 backdrop-blur-sm border-yellow-500/50 hover:bg-yellow-500/20 shadow-lg hover:shadow-yellow-500/30 group"
          onClick={handleShare}
          title="Share this business card"
        >
          <Share2 size={16} className="text-yellow-400 drop-shadow-sm group-hover:text-yellow-300" />
        </div>
      </div>



      {/* Card Header */}
      <div className={`card-header ${isAnimated ? 'animate-fade-in' : ''}`}>
        {card.badge && (
          <div className="absolute top-2 right-2 z-20">
            <ExclusiveBadge type={card.badge as BadgeType} className="premium-badge" />
          </div>
        )}
        <h2 className={`font-${themeStyles.fontPair?.heading || 'playfair'} text-3xl font-extrabold mb-1 ${isAnimated ? 'animate-fade-in' : ''}`}>
          {card.name}
        </h2>
        <p className={`font-${themeStyles.fontPair?.body || 'lora'} text-base font-medium ${isAnimated ? 'animate-fade-in animate-delay-200' : ''}`}>
          {card.tagline}
        </p>

        {/* Logo */}
        <div className={`logo-circle ${isAnimated ? 'animate-fade-in animate-delay-300' : ''}`}>
          {card.logo ? (
            <div className="w-full h-full rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20">
              <img
                src={card.logo}
                alt={`${card.name} Logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/130x130/cccccc/666666?text=' + encodeURIComponent(card.name.charAt(0));
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full">
              <span className="text-2xl font-bold text-white">
                {card.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="py-5 px-4 text-center">
        {/* Enhanced Social Icons with Premium Styling */}
        <div className={`flex justify-center flex-wrap gap-3 mt-20 mb-6 ${isAnimated ? 'animate-fade-in animate-delay-400' : ''}`}>
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="icon-circle premium-icon-circle group"
              aria-label="Email Us"
            >
              <Mail size={20} className="group-hover:scale-110 transition-transform duration-300" />

            </a>
          )}

          {card.instagram && (
            <a
              href={`https://www.instagram.com/${card.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle premium-icon-circle group"
              aria-label="Instagram"
            >
              <Instagram size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </a>
          )}

          {card.whatsapp && (
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle premium-icon-circle group"
              aria-label="WhatsApp"
            >
              <MessageSquare size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </a>
          )}

          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle premium-icon-circle group"
              aria-label="Visit Website"
            >
              <Globe size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </a>
          )}

          {/* Additional Social Media Icons */}
          {card.linkedin && (
            <a
              href={`https://www.linkedin.com/in/${card.linkedin}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle premium-icon-circle group"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </a>
          )}

          {card.twitter && (
            <a
              href={`https://twitter.com/${card.twitter}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle premium-icon-circle group"
              aria-label="Twitter"
            >
              <Twitter size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </a>
          )}

          {card.facebook && (
            <a
              href={`https://facebook.com/${card.facebook}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle premium-icon-circle group"
              aria-label="Facebook"
            >
              <Facebook size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </a>
          )}
        </div>

        {/* Welcome Text */}
        <h3 className={`font-playfair text-2xl font-bold mb-3 relative inline-block ${isAnimated ? 'animate-fade-in animate-delay-500' : ''}`}>
          Welcome to {card.name}
          <span className="absolute bottom-0 left-0 w-full h-0.5 transform translate-y-2"></span>
        </h3>

        {card.description && (
          <p className={`mb-6 max-w-[90%] mx-auto ${isAnimated ? 'animate-fade-in animate-delay-600' : ''}`}>
            {card.description}
          </p>
        )}

        {/* Compact Contact Details */}
        <div className={`mt-6 text-left space-y-2 ${isAnimated ? 'animate-fade-in animate-delay-700' : ''}`}>
          {card.phone && (
            <div className="detail-item premium-detail-item group mb-2 p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/30">
              <Phone className="mr-2 flex-shrink-0 text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300" size={16} />
              <span className="group-hover:text-yellow-100 transition-colors duration-300 text-sm">
                +91 {card.phone.replace(/^\+91\s*/, '')}
              </span>
            </div>
          )}

          {card.whatsapp && (
            <div className="detail-item premium-detail-item group mb-2 p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/30">
              <MessageSquare className="mr-2 flex-shrink-0 text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300" size={16} />
              <span className="group-hover:text-yellow-100 transition-colors duration-300 text-sm">
                +91 {card.whatsapp.replace(/^\+91\s*/, '')}
              </span>
            </div>
          )}

          {card.email && (
            <div className="detail-item premium-detail-item group mb-2 p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/30">
              <Mail className="mr-2 flex-shrink-0 text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300" size={16} />
              <span className="break-all group-hover:text-yellow-100 transition-colors duration-300 text-sm">{card.email}</span>
            </div>
          )}

          {card.website && (
            <div className="detail-item premium-detail-item group mb-2 p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/30">
              <Globe className="mr-2 flex-shrink-0 text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300" size={16} />
              <span className="break-all group-hover:text-yellow-100 transition-colors duration-300 text-sm">
                https://{card.website.replace(/^https?:\/\//, '')}
              </span>
            </div>
          )}

          {card.address && (
            <div className="detail-item premium-detail-item group mb-2 p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/30">
              <MapPin className="mr-2 flex-shrink-0 text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300" size={16} />
              <span className="group-hover:text-yellow-100 transition-colors duration-300 text-sm">{card.address}</span>
            </div>
          )}
        </div>

        {/* Compact Premium CTA Button */}
        <div className={`mt-6 text-center ${isAnimated ? 'animate-fade-in animate-delay-800' : ''}`}>
          <button
            onClick={handleDownloadVCard}
            className="premium-cta-button group relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 border-2 border-yellow-400 hover:border-yellow-300 font-playfair text-base"
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600"></div>

            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center">
              <ContactRound className="inline-block mr-2 group-hover:scale-110 transition-transform duration-300" size={18} />
              <span className="group-hover:tracking-wide transition-all duration-300">Save Contact</span>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl group-hover:bg-yellow-400/40 transition-all duration-300"></div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={`py-4 px-3 text-center text-xs border-t ${isAnimated ? 'animate-fade-in animate-delay-900' : ''}`}>
        © {new Date().getFullYear()} {card.name}. All Rights Reserved.
      </div>
    </div>

    {/* Share Modal - Outside card container */}
    <ShareModal
      card={card}
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
    />
    </>
  );
};

export default CardPreview;
