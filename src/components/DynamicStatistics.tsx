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
    { id: '1', type: 'bar', title: 'Zone Tables', description: 'Number of tables by zone', dataKey: 'zone', fullWidth: false, enabled: true },
    { id: '2', type: 'bar', title: 'Capacity Distribution', description: 'Table capacity breakdown', dataKey: 'capacity', fullWidth: false, enabled: true },
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
    const totalCapacity = filteredTables.reduce((sum, table) => {
      const zoneId = typeof table.zoneId === 'object' ? table.zoneId._id : table.zoneId;
      const zone = zones.find(z => z._id === zoneId);
      return sum + (zone?.seatsPerTable || 0);
    }, 0);

    return {
      totalTables,
      totalCapacity
    };
  }, [filteredTables, zones]);

  // Generate chart data based on filtered tables
  const zoneTableData = useMemo(() => {
    if (selectedZone === 'all') {
      // Show all zones
      return zones.map(zone => {
        const zoneTables = tables.filter(t => {
          const tableZoneId = typeof t.zoneId === 'object' ? t.zoneId._id : t.zoneId;
          return tableZoneId === zone._id;
        });
        
        return {
          zone: zone.name,
          total: zoneTables.length
        };
      });
    } else {
      // Show only selected zone
      const zone = zones.find(z => z._id === selectedZone);
      if (!zone) return [];
      
      return [{
        zone: zone.name,
        total: filteredTables.length
      }];
    }
  }, [tables, zones, selectedZone, filteredTables]);



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
        
        return {
          zone: zone.name,
          tables: zoneTables.length,
          capacity: totalCapacity
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
      
      return [{
        zone: zone.name,
        tables: filteredTables.length,
        capacity: totalCapacity
      }];
    }
  }, [tables, zones, selectedZone, filteredTables]);

  const quickStats = [
    { label: 'Total Tables', value: statistics.totalTables.toString(), change: '', positive: true },
    { label: 'Total Capacity', value: `${statistics.totalCapacity} seats`, change: '', positive: true },
  ];

  const renderChart = (config: ChartConfig) => {
    if (!config.enabled) return null;

    switch (config.type) {
      case 'bar':
        if (config.dataKey === 'zone') {
          return (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zoneTableData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#06b6d4" name="Tables" />
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



      case 'line':
        if (config.dataKey === 'performance') {
          return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={zonePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tables" stroke="#06b6d4" name="Tables" />
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
