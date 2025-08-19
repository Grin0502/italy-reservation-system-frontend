# Dynamic Statistics Page Features

## Overview
The statistics page has been enhanced with dynamic functionality that allows managers and admins to add/remove tables, modify zones, and customize the dashboard based on their role permissions.

## Key Features

### 1. Role-Based Access Control
- **Admin**: Full access to all features including user management
- **Manager**: Can manage tables and zones, customize statistics dashboard
- **Staff**: View-only access to statistics

### 2. Table Management
- Add new tables with custom properties (number, zone, capacity, status)
- Edit existing table details
- Delete tables with confirmation
- Real-time status tracking (Available, Occupied, Reserved, Maintenance)
- Visual status indicators with color coding

### 3. Zone Management
- Create new zones with custom names, descriptions, and colors
- Edit zone properties
- Delete zones (with confirmation for zones containing tables)
- View zone statistics including table count and occupancy rates
- Visual zone representation with custom colors

### 4. Dynamic Statistics Dashboard
- Real-time statistics based on current table and zone data
- Customizable chart configurations
- Multiple chart types (Bar, Line, Pie)
- Quick stats cards showing key metrics
- Role-based customization permissions

### 5. Interactive Features
- Tabbed interface for different management sections
- Modal forms for adding/editing tables and zones
- Real-time data updates
- Responsive design for different screen sizes

## Technical Implementation

### Context Providers
- `UserContext`: Manages user authentication and role-based permissions
- `TableZoneContext`: Manages table and zone data with CRUD operations

### Components
- `DynamicStatistics`: Main statistics dashboard with real-time data
- `TableManagement`: Interface for managing tables
- `ZoneManagement`: Interface for managing zones

### Data Flow
1. User context provides role-based permissions
2. Table/Zone context manages the data state
3. Components render based on user permissions
4. Real-time statistics are calculated from current data
5. Changes are immediately reflected in the UI

## Usage

### For Admins/Managers
1. Navigate to the Statistics page
2. Use the role switcher to test different permissions
3. Switch between Statistics, Table Management, and Zone Management tabs
4. Add, edit, or delete tables and zones as needed
5. Customize the statistics dashboard by toggling chart visibility

### For Staff
1. View the statistics dashboard
2. Monitor real-time table and zone status
3. Access is limited to view-only mode

## Development Features

### Role Switcher
- Allows testing different user roles during development
- Shows current active role
- Provides role descriptions and permissions overview

### Real-time Updates
- All changes are immediately reflected in statistics
- No page refresh required
- Consistent data across all components

## Future Enhancements
- Persistent data storage (database integration)
- Advanced analytics and reporting
- User authentication system
- Audit logs for changes
- Export functionality for reports
- Mobile-responsive table management
- Drag-and-drop table positioning
- Advanced zone visualization
