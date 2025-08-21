import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTableZone } from '../contexts/TableZoneContext';
import { useUser } from '../contexts/UserContext';

interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie';
  title: string;
  description: string;
  dataKey: string;
  fullWidth?: boolean;
  enabled: boolean;
}

const DynamicStatistics: React.FC = () => {
  const { tables, zones } = useTableZone();
  const { hasPermission } = useUser();
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedZone, setSelectedZone] = useState('all');
  const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>([
    { id: '1', type: 'bar', title: 'Zone Occupancy', description: 'Current table status by zone', dataKey: 'zone', fullWidth: false, enabled: true },
    { id: '2', type: 'pie', title: 'Table Status Distribution', description: 'Overall table status breakdown', dataKey: 'status', fullWidth: false, enabled: true },
    { id: '3', type: 'bar', title: 'Capacity Distribution', description: 'Table capacity breakdown', dataKey: 'capacity', fullWidth: false, enabled: true },
    { id: '4', type: 'line', title: 'Zone Performance', description: 'Zone comparison metrics', dataKey: 'performance', fullWidth: true, enabled: true },
  ]);

  // Filter tables based on selected zone
  const filteredTables = useMemo(() => {
    if (selectedZone === 'all') {
      return tables;
    }
    return tables.filter(table => {
      const zoneId = typeof table.zoneId === 'object' ? table.zoneId._id : table.zoneId;
      return zoneId === selectedZone;
    });
  }, [tables, selectedZone]);

  // Calculate real-time statistics based on filtered tables
  const statistics = useMemo(() => {
    const totalTables = filteredTables.length;
    const availableTables = filteredTables.filter(t => t.status === 'available').length;
    const occupiedTables = filteredTables.filter(t => t.status === 'occupied').length;
    const reservedTables = filteredTables.filter(t => t.status === 'reserved').length;
    const maintenanceTables = filteredTables.filter(t => t.status === 'maintenance').length;
    const totalCapacity = filteredTables.reduce((sum, table) => {
      const zoneId = typeof table.zoneId === 'object' ? table.zoneId._id : table.zoneId;
      const zone = zones.find(z => z._id === zoneId);
      return sum + (zone?.seatsPerTable || 0);
    }, 0);
    const occupancyRate = totalTables > 0 ? ((occupiedTables + reservedTables) / totalTables * 100).toFixed(1) : '0';

    return {
      totalTables,
      availableTables,
      occupiedTables,
      reservedTables,
      maintenanceTables,
      totalCapacity,
      occupancyRate
    };
  }, [filteredTables]);

  // Generate chart data based on filtered tables
  const zoneOccupancyData = useMemo(() => {
    if (selectedZone === 'all') {
      // Show all zones
      return zones.map(zone => {
        const zoneTables = tables.filter(t => {
          const tableZoneId = typeof t.zoneId === 'object' ? t.zoneId._id : t.zoneId;
          return tableZoneId === zone._id;
        });
        const available = zoneTables.filter(t => t.status === 'available').length;
        const occupied = zoneTables.filter(t => t.status === 'occupied').length;
        const reserved = zoneTables.filter(t => t.status === 'reserved').length;
        const maintenance = zoneTables.filter(t => t.status === 'maintenance').length;
        
        return {
          zone: zone.name,
          available,
          occupied,
          reserved,
          maintenance,
          total: zoneTables.length
        };
      });
    } else {
      // Show only selected zone
      const zone = zones.find(z => z._id === selectedZone);
      if (!zone) return [];
      
      const available = filteredTables.filter(t => t.status === 'available').length;
      const occupied = filteredTables.filter(t => t.status === 'occupied').length;
      const reserved = filteredTables.filter(t => t.status === 'reserved').length;
      const maintenance = filteredTables.filter(t => t.status === 'maintenance').length;
      
      return [{
        zone: zone.name,
        available,
        occupied,
        reserved,
        maintenance,
        total: filteredTables.length
      }];
    }
  }, [tables, zones, selectedZone, filteredTables]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'occupied': return '#ef4444';
      case 'reserved': return '#f59e0b';
      case 'maintenance': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const statusDistributionData = useMemo(() => {
    const statusCounts = {
      available: filteredTables.filter(t => t.status === 'available').length,
      occupied: filteredTables.filter(t => t.status === 'occupied').length,
      reserved: filteredTables.filter(t => t.status === 'reserved').length,
      maintenance: filteredTables.filter(t => t.status === 'maintenance').length
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: getStatusColor(status)
    }));
  }, [filteredTables]);

  const capacityDistributionData = useMemo(() => {
    const capacityCounts: { [key: number]: number } = {};
    filteredTables.forEach(table => {
      const zoneId = typeof table.zoneId === 'object' ? table.zoneId._id : table.zoneId;
      const zone = zones.find(z => z._id === zoneId);
      const capacity = zone?.seatsPerTable || 0;
      capacityCounts[capacity] = (capacityCounts[capacity] || 0) + 1;
    });

    return Object.entries(capacityCounts).map(([capacity, count]) => ({
      capacity: `${capacity} seats`,
      count
    }));
  }, [filteredTables, zones]);

  const zonePerformanceData = useMemo(() => {
    if (selectedZone === 'all') {
      // Show all zones
      return zones.map(zone => {
        const zoneTables = tables.filter(t => {
          const tableZoneId = typeof t.zoneId === 'object' ? t.zoneId._id : t.zoneId;
          return tableZoneId === zone._id;
        });
        const totalCapacity = zoneTables.reduce((sum, table) => {
          const tableZoneId = typeof table.zoneId === 'object' ? table.zoneId._id : table.zoneId;
          const tableZone = zones.find(z => z._id === tableZoneId);
          return sum + (tableZone?.seatsPerTable || 0);
        }, 0);
        const occupancyRate = zoneTables.length > 0 
          ? ((zoneTables.filter(t => t.status === 'occupied' || t.status === 'reserved').length / zoneTables.length) * 100).toFixed(1)
          : 0;
        
        return {
          zone: zone.name,
          tables: zoneTables.length,
          capacity: totalCapacity,
          occupancyRate: parseFloat(occupancyRate.toString())
        };
      });
    } else {
      // Show only selected zone
      const zone = zones.find(z => z._id === selectedZone);
      if (!zone) return [];
      
      const totalCapacity = filteredTables.reduce((sum, table) => {
        const tableZoneId = typeof table.zoneId === 'object' ? table.zoneId._id : table.zoneId;
        const tableZone = zones.find(z => z._id === tableZoneId);
        return sum + (tableZone?.seatsPerTable || 0);
      }, 0);
      const occupancyRate = filteredTables.length > 0 
        ? ((filteredTables.filter(t => t.status === 'occupied' || t.status === 'reserved').length / filteredTables.length) * 100).toFixed(1)
        : 0;
      
      return [{
        zone: zone.name,
        tables: filteredTables.length,
        capacity: totalCapacity,
        occupancyRate: parseFloat(occupancyRate.toString())
      }];
    }
  }, [tables, zones, selectedZone, filteredTables]);

  const quickStats = [
    { label: 'Total Tables', value: statistics.totalTables.toString(), change: '', positive: true },
    { label: 'Available Tables', value: statistics.availableTables.toString(), change: '', positive: true },
    { label: 'Occupancy Rate', value: `${statistics.occupancyRate}%`, change: '', positive: true },
    { label: 'Total Capacity', value: `${statistics.totalCapacity} seats`, change: '', positive: true },
  ];

  const renderChart = (config: ChartConfig) => {
    if (!config.enabled) return null;

    switch (config.type) {
      case 'bar':
        if (config.dataKey === 'zone') {
          return (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zoneOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="available" fill="#10b981" name="Available" />
                <Bar dataKey="occupied" fill="#ef4444" name="Occupied" />
                <Bar dataKey="reserved" fill="#f59e0b" name="Reserved" />
                <Bar dataKey="maintenance" fill="#6b7280" name="Maintenance" />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if (config.dataKey === 'capacity') {
          return (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={capacityDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="capacity" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" name="Tables" />
              </BarChart>
            </ResponsiveContainer>
          );
        }
        break;

      case 'pie':
        if (config.dataKey === 'status') {
          return (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ? percent : 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          );
        }
        break;

      case 'line':
        if (config.dataKey === 'performance') {
          return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={zonePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="tables" stroke="#06b6d4" name="Tables" />
                <Line yAxisId="right" type="monotone" dataKey="occupancyRate" stroke="#10b981" name="Occupancy %" />
              </LineChart>
            </ResponsiveContainer>
          );
        }
        break;
    }
    return null;
  };

  return (
    <Container>
      <Header>
        <div>
          <h1>Dynamic Statistics & Analytics</h1>
          <p>Real-time restaurant performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ZoneSelector>
            <ZoneLabel>Filter by Zone:</ZoneLabel>
            <ZoneSelect 
              value={selectedZone} 
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="all">All Zones</option>
              {zones.map(zone => (
                <option key={zone._id} value={zone._id}>
                  {zone.name}
                </option>
              ))}
            </ZoneSelect>
          </ZoneSelector>
          {hasPermission('edit_statistics') && (
            <CustomizeButton onClick={() => setShowCustomization(!showCustomization)}>
              {showCustomization ? 'Done' : 'Customize Dashboard'}
            </CustomizeButton>
          )}
        </div>
      </Header>

      {/* Quick Stats */}
      <StatsGrid>
        {quickStats.map((stat, index) => (
          <StatCard key={index}>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue>{stat.value}</StatValue>
            {stat.change && (
              <StatChange positive={stat.positive}>
                {stat.change}
              </StatChange>
            )}
          </StatCard>
        ))}
      </StatsGrid>

      {/* Chart Customization Panel */}
      {showCustomization && hasPermission('edit_statistics') && (
        <CustomizationPanel>
          <h3>Customize Dashboard</h3>
          <ChartConfigGrid>
            {chartConfigs.map(config => (
              <ChartConfigCard key={config.id}>
                <ConfigHeader>
                  <ConfigTitle>{config.title}</ConfigTitle>
                  <ConfigToggle
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => {
                      setChartConfigs(prev => prev.map(c => 
                        c.id === config.id ? { ...c, enabled: e.target.checked } : c
                      ));
                    }}
                  />
                </ConfigHeader>
                <ConfigDescription>{config.description}</ConfigDescription>
              </ChartConfigCard>
            ))}
          </ChartConfigGrid>
        </CustomizationPanel>
      )}

      {/* Charts */}
      <ChartsGrid>
        {chartConfigs
          .filter(config => config.enabled)
          .map(config => (
            <ChartCard key={config.id} fullWidth={config.fullWidth}>
              <ChartHeader>
                <h3>{config.title}</h3>
                <p>{config.description}</p>
              </ChartHeader>
              {renderChart(config)}
            </ChartCard>
          ))}
      </ChartsGrid>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 1.1rem;
  }
`;

const ZoneSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ZoneLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const ZoneSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
`;

const CustomizeButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0891b2;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div<{ positive: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  font-weight: 500;
`;

const CustomizationPanel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const ChartConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ChartConfigCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: #f9fafb;
`;

const ConfigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ConfigTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
`;

const ConfigToggle = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ConfigDescription = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div<{ fullWidth?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const ChartHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

export default DynamicStatistics;
