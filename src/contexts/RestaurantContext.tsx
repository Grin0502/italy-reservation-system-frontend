import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface RestaurantContextType {
  restaurantInfo: RestaurantInfo;
  notificationSettings: NotificationSettings;
  bookingRules: BookingRules;
  updateRestaurantInfo: (updates: Partial<RestaurantInfo>) => void;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;
  updateBookingRules: (updates: Partial<BookingRules>) => void;
  calculateTotalCapacity: () => number;
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
    depositAmount: 0
  });

  const updateRestaurantInfo = (updates: Partial<RestaurantInfo>) => {
    setRestaurantInfo(prev => ({ ...prev, ...updates }));
  };

  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...updates }));
  };

  const updateBookingRules = (updates: Partial<BookingRules>) => {
    setBookingRules(prev => ({ ...prev, ...updates }));
  };

  // This will be calculated from actual table data
  const calculateTotalCapacity = () => {
    // This should be calculated from the TableZoneContext
    // For now, return the stored capacity
    return restaurantInfo.capacity;
  };

  return (
    <RestaurantContext.Provider value={{
      restaurantInfo,
      notificationSettings,
      bookingRules,
      updateRestaurantInfo,
      updateNotificationSettings,
      updateBookingRules,
      calculateTotalCapacity
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
