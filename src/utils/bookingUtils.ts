import type { BookingRules } from '../contexts/RestaurantContext';

export interface BookingTime {
  startTime: Date;
  endTime: Date;
}

export interface TableBooking {
  id: string;
  tableId: string;
  startTime: Date;
  endTime: Date;
  customerName: string;
  partySize: number;
}

/**
 * Calculate the next available booking time after a booking ends
 * @param bookingEndTime - When the current booking ends
 * @param bookingRules - Current booking rules including time margin
 * @returns Date object representing the next available booking time
 */
export const calculateNextAvailableTime = (
  bookingEndTime: Date,
  bookingRules: BookingRules
): Date => {
  const nextAvailableTime = new Date(bookingEndTime);
  nextAvailableTime.setMinutes(nextAvailableTime.getMinutes() + bookingRules.bookingTimeMargin);
  return nextAvailableTime;
};

/**
 * Check if a table is available for a given time slot
 * @param requestedStartTime - When the new booking would start
 * @param requestedEndTime - When the new booking would end
 * @param existingBookings - Array of existing bookings for the table
 * @param bookingRules - Current booking rules
 * @returns boolean indicating if the table is available
 */
export const isTableAvailable = (
  requestedStartTime: Date,
  requestedEndTime: Date,
  existingBookings: TableBooking[],
  bookingRules: BookingRules
): boolean => {
  for (const booking of existingBookings) {
    // Calculate when the table becomes available after this booking
    const tableAvailableAfter = calculateNextAvailableTime(booking.endTime, bookingRules);
    
    // Check for overlap: new booking starts before table is available
    if (requestedStartTime < tableAvailableAfter) {
      return false;
    }
    
    // Check for overlap: new booking ends after existing booking starts
    if (requestedEndTime > booking.startTime) {
      return false;
    }
  }
  
  return true;
};

/**
 * Get all available time slots for a table on a given date
 * @param date - The date to check availability for
 * @param existingBookings - Array of existing bookings for the table
 * @param bookingRules - Current booking rules
 * @param openingHours - Restaurant opening hours (e.g., "12:00 - 23:00")
 * @param slotDuration - Duration of each booking slot in minutes (default: 60)
 * @returns Array of available time slots
 */
export const getAvailableTimeSlots = (
  date: Date,
  existingBookings: TableBooking[],
  bookingRules: BookingRules,
  openingHours: string,
  slotDuration: number = 60
): Date[] => {
  const availableSlots: Date[] = [];
  
  // Parse opening hours (assuming format "HH:MM - HH:MM")
  const [openTime, closeTime] = openingHours.split(' - ');
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  
  // Create opening and closing times for the given date
  const openingTime = new Date(date);
  openingTime.setHours(openHour, openMinute, 0, 0);
  
  const closingTime = new Date(date);
  closingTime.setHours(closeHour, closeMinute, 0, 0);
  
  // Generate time slots
  let currentSlot = new Date(openingTime);
  
  while (currentSlot < closingTime) {
    const slotEndTime = new Date(currentSlot);
    slotEndTime.setMinutes(slotEndTime.getMinutes() + slotDuration);
    
    // Check if this slot is available
    if (isTableAvailable(currentSlot, slotEndTime, existingBookings, bookingRules)) {
      availableSlots.push(new Date(currentSlot));
    }
    
    // Move to next slot
    currentSlot.setMinutes(currentSlot.getMinutes() + slotDuration);
  }
  
  return availableSlots;
};

/**
 * Format time margin for display
 * @param minutes - Time margin in minutes
 * @returns Formatted string (e.g., "1 hour 30 minutes")
 */
export const formatTimeMargin = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  } else if (mins === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
  }
};

/**
 * Get a human-readable description of the booking time margin
 * @param bookingRules - Current booking rules
 * @returns Description of how the time margin works
 */
export const getTimeMarginDescription = (bookingRules: BookingRules): string => {
  const marginText = formatTimeMargin(bookingRules.bookingTimeMargin);
  return `Tables remain unavailable for ${marginText} after each booking ends to allow for cleanup and preparation.`;
};
