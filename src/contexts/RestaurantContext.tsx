import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { restaurantAPI } from '../services/api';

export interface RestaurantInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  capacity: number;
  openingHours: string;
  description?: string;
  website?: string;
  cuisine?: string;
  priceRange?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface BookingRules {
  maxPartySize: number;
  advanceBookingLimit: number;
  cancellationPolicy: number;
  depositRequired: boolean;
  depositAmount?: number;
  bookingTimeMargin: number; // Time in minutes that a table remains unavailable after a booking
}

interface RestaurantContextType {
  restaurantInfo: RestaurantInfo;
  notificationSettings: NotificationSettings;
  bookingRules: BookingRules;
  loading: boolean;
  error: string | null;
  updateRestaurantInfo: (updates: Partial<RestaurantInfo>) => Promise<void>;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
  updateBookingRules: (updates: Partial<BookingRules>) => Promise<void>;
  calculateTotalCapacity: () => number;
  refreshData: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    id: '1',
    name: 'Ristorante Bella Vista',
    phone: '+39 123 456 789',
    email: 'info@bella-vista.it',
    address: 'Via Roma 123, Milano, Italy',
    capacity: 120,
    openingHours: '12:00 - 23:00',
    description: 'Authentic Italian cuisine in the heart of Milan',
    website: 'www.bella-vista.it',
    cuisine: 'Italian',
    priceRange: '€€€'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const [bookingRules, setBookingRules] = useState<BookingRules>({
    maxPartySize: 12,
    advanceBookingLimit: 30,
    cancellationPolicy: 24,
    depositRequired: false,
    depositAmount: 0,
    bookingTimeMargin: 90 // 90 minutes = 1.5 hours default margin
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurant data from backend
  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [infoResponse, settingsResponse] = await Promise.all([
        restaurantAPI.getInfo(),
        restaurantAPI.getSettings()
      ]);

      if (infoResponse.success && infoResponse.data) {
        setRestaurantInfo({
          id: infoResponse.data._id || '1',
          name: infoResponse.data.name,
          phone: infoResponse.data.phone,
          email: infoResponse.data.email,
          address: infoResponse.data.address,
          capacity: infoResponse.data.capacity,
          openingHours: infoResponse.data.openingHours,
          description: infoResponse.data.description,
          website: infoResponse.data.website,
          cuisine: infoResponse.data.cuisine,
          priceRange: infoResponse.data.priceRange
        });
      }

      if (settingsResponse.success && settingsResponse.data) {
        if (settingsResponse.data.notificationSettings) {
          setNotificationSettings(settingsResponse.data.notificationSettings);
        }
        if (settingsResponse.data.bookingRules) {
          setBookingRules(settingsResponse.data.bookingRules);
        }
      }
    } catch (err) {
      console.error('Error fetching restaurant data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurant data');
    } finally {
      setLoading(false);
    }
  };

  // Update restaurant info with API call
  const updateRestaurantInfo = async (updates: Partial<RestaurantInfo>) => {
    try {
      console.log('🔄 Updating restaurant info:', updates);
      setError(null);
      const response = await restaurantAPI.updateInfo(updates);
      
      console.log('📡 API response:', response);
      
      if (response.success && response.data) {
        setRestaurantInfo(prev => ({ ...prev, ...updates }));
        console.log('✅ Restaurant info updated successfully');
      } else {
        throw new Error(response.error || 'Failed to update restaurant info');
      }
    } catch (err) {
      console.error('❌ Error updating restaurant info:', err);
      setError(err instanceof Error ? err.message : 'Failed to update restaurant info');
      throw err;
    }
  };

  // Update notification settings with API call
  const updateNotificationSettings = async (updates: Partial<NotificationSettings>) => {
    try {
      console.log('🔄 Updating notification settings:', updates);
      setError(null);
      const response = await restaurantAPI.updateNotifications(updates);
      
      console.log('📡 Notification API response:', response);
      
      if (response.success && response.data) {
        setNotificationSettings(prev => ({ ...prev, ...updates }));
        console.log('✅ Notification settings updated successfully');
      } else {
        throw new Error(response.error || 'Failed to update notification settings');
      }
    } catch (err) {
      console.error('❌ Error updating notification settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update notification settings');
      throw err;
    }
  };

  // Update booking rules with API call
  const updateBookingRules = async (updates: Partial<BookingRules>) => {
    try {
      console.log('🔄 Updating booking rules:', updates);
      setError(null);
      const response = await restaurantAPI.updateBookingRules(updates);
      
      console.log('📡 Booking rules API response:', response);
      
      if (response.success && response.data) {
        setBookingRules(prev => ({ ...prev, ...updates }));
        console.log('✅ Booking rules updated successfully');
      } else {
        throw new Error(response.error || 'Failed to update booking rules');
      }
    } catch (err) {
      console.error('❌ Error updating booking rules:', err);
      throw err;
    }
  };

  // Refresh data from backend
  const refreshData = async () => {
    await fetchRestaurantData();
  };

  // This will be calculated from actual table data
  const calculateTotalCapacity = () => {
    // This should be calculated from the TableZoneContext
    // For now, return the stored capacity
    return restaurantInfo.capacity;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRestaurantData();
  }, []);

  return (
    <RestaurantContext.Provider value={{
      restaurantInfo,
      notificationSettings,
      bookingRules,
      loading,
      error,
      updateRestaurantInfo,
      updateNotificationSettings,
      updateBookingRules,
      calculateTotalCapacity,
      refreshData
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
