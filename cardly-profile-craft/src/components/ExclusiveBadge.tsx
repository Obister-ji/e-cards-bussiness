import React from 'react';
import { Shield, Award, CheckCircle2, Crown } from 'lucide-react';

export type BadgeType = 'vip' | 'verified' | 'premium' | 'elite' | 'none';

interface ExclusiveBadgeProps {
  type: BadgeType;
  className?: string;
}

const ExclusiveBadge: React.FC<ExclusiveBadgeProps> = ({ type, className = '' }) => {
  if (type === 'none') return null;

  const getBadgeContent = () => {
    switch (type) {
      case 'vip':
        return {
          icon: <Crown size={14} className="mr-1" />,
          text: 'VIP Member',
          classes: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
        };
      case 'verified':
        return {
          icon: <CheckCircle2 size={14} className="mr-1" />,
          text: 'Verified',
          classes: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
        };
      case 'premium':
        return {
          icon: <Award size={14} className="mr-1" />,
          text: 'Premium',
          classes: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        };
      case 'elite':
        return {
          icon: <Shield size={14} className="mr-1" />,
          text: 'Elite',
          classes: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
        };
      default:
        return null;
    }
  };

  const badgeContent = getBadgeContent();
  if (!badgeContent) return null;

  return (
    <div 
      className={`
        exclusive-badge inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full 
        shadow-lg backdrop-blur-sm ${badgeContent.classes} ${className}
      `}
    >
      {badgeContent.icon}
      {badgeContent.text}
    </div>
  );
};

export default ExclusiveBadge;
