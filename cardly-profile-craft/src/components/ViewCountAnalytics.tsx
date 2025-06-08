import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, BarChart3, RefreshCw } from "lucide-react";
import { BusinessCard } from '@/types/types';
import { shareService } from '@/lib/shareService';

interface ViewCountAnalyticsProps {
  card?: BusinessCard;
  className?: string;
}

const ViewCountAnalytics: React.FC<ViewCountAnalyticsProps> = ({ card, className = '' }) => {
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [totalViews, setTotalViews] = useState(0);
  const [cardViews, setCardViews] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshAnalytics = () => {
    const allCounts = shareService.getAllViewCounts();
    setViewCounts(allCounts);
    
    const total = Object.values(allCounts).reduce((sum, count) => sum + count, 0);
    setTotalViews(total);
    
    if (card) {
      setCardViews(allCounts[card.id] || 0);
    }
    
    setLastUpdated(new Date());
    console.log('📊 Analytics refreshed:', { allCounts, total, cardViews: card ? allCounts[card.id] || 0 : 0 });
  };

  useEffect(() => {
    refreshAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshAnalytics, 30000);
    return () => clearInterval(interval);
  }, [card]);

  const getTopCards = () => {
    const businessCards = localStorage.getItem('businessCards');
    if (!businessCards) return [];
    
    const cards: BusinessCard[] = JSON.parse(businessCards);
    return cards
      .map(c => ({
        card: c,
        views: viewCounts[c.id] || 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  };

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString();
  };

  if (card) {
    // Single card view
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Eye className="w-5 h-5 text-blue-500" />
            <span>View Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{cardViews}</div>
              <div className="text-sm text-gray-500">Total Views</div>
            </div>
            <Button
              onClick={refreshAnalytics}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
          
          <div className="text-xs text-gray-400">
            Last updated: {formatLastUpdated()}
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              📈 View Tracking
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              Views are tracked across all browsers and devices. Each unique visit increments the counter.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // All cards analytics view
  const topCards = getTopCards();

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          <span>View Analytics Dashboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Views</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalViews}</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">Active Cards</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{Object.keys(viewCounts).length}</div>
          </div>
        </div>

        {/* Top Cards */}
        {topCards.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Top Performing Cards</h4>
              <Button
                onClick={refreshAnalytics}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              {topCards.map((item, index) => (
                <div
                  key={item.card.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {item.card.name}
                      </div>
                      {item.card.tagline && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.card.tagline}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {item.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {topCards.length === 0 && (
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-500 dark:text-gray-400 mb-2">No view data yet</div>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Create and share business cards to start tracking views
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-400 text-center">
          Last updated: {formatLastUpdated()}
        </div>

        {/* Info */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            📊 How View Tracking Works
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>• Views are tracked across all browsers and devices</div>
            <div>• Each unique visit to a shared card increments the counter</div>
            <div>• View counts are embedded in share URLs for cross-browser sync</div>
            <div>• Data is stored locally and synced when cards are accessed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewCountAnalytics;
