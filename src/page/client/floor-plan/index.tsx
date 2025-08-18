import styled from "styled-components";
import { useState } from "react";

const FloorPlanPage = () => {
  const [selectedZone, setSelectedZone] = useState('all');

  const zones = [
    { id: 'all', name: 'All Zones', count: 16 },
    { id: 'a', name: 'Zone A - Window', count: 6 },
    { id: 'b', name: 'Zone B - Center', count: 6 },
    { id: 'c', name: 'Zone C - Garden', count: 4 },
  ];

  // Define tables for each zone
  const allTables = [
    // Zone A - Window tables (A1-A6)
    { id: 1, number: 'A1', zone: 'a', status: 'available', capacity: 2, position: { row: 1, col: 1 } },
    { id: 2, number: 'A2', zone: 'a', status: 'occupied', capacity: 4, position: { row: 1, col: 2 } },
    { id: 3, number: 'A3', zone: 'a', status: 'available', capacity: 2, position: { row: 1, col: 3 } },
    { id: 4, number: 'A4', zone: 'a', status: 'available', capacity: 6, position: { row: 2, col: 1 } },
    { id: 5, number: 'A5', zone: 'a', status: 'occupied', capacity: 4, position: { row: 2, col: 2 } },
    { id: 6, number: 'A6', zone: 'a', status: 'available', capacity: 2, position: { row: 2, col: 3 } },
    
    // Zone B - Center tables (B1-B6)
    { id: 7, number: 'B1', zone: 'b', status: 'available', capacity: 8, position: { row: 1, col: 1 } },
    { id: 8, number: 'B2', zone: 'b', status: 'occupied', capacity: 6, position: { row: 1, col: 2 } },
    { id: 9, number: 'B3', zone: 'b', status: 'available', capacity: 4, position: { row: 1, col: 3 } },
    { id: 10, number: 'B4', zone: 'b', status: 'available', capacity: 2, position: { row: 2, col: 1 } },
    { id: 11, number: 'B5', zone: 'b', status: 'occupied', capacity: 4, position: { row: 2, col: 2 } },
    { id: 12, number: 'B6', zone: 'b', status: 'available', capacity: 6, position: { row: 2, col: 3 } },
    
    // Zone C - Garden tables (C1-C4)
    { id: 13, number: 'C1', zone: 'c', status: 'available', capacity: 4, position: { row: 1, col: 1 } },
    { id: 14, number: 'C2', zone: 'c', status: 'occupied', capacity: 6, position: { row: 1, col: 2 } },
    { id: 15, number: 'C3', zone: 'c', status: 'available', capacity: 2, position: { row: 2, col: 1 } },
    { id: 16, number: 'C4', zone: 'c', status: 'available', capacity: 4, position: { row: 2, col: 2 } },
  ];

  // Filter tables based on selected zone
  const getFilteredTables = () => {
    if (selectedZone === 'all') {
      return allTables;
    }
    return allTables.filter(table => table.zone === selectedZone);
  };

  const filteredTables = getFilteredTables();

  // Get grid layout based on selected zone
  const getGridLayout = () => {
    switch (selectedZone) {
      case 'a':
        return 'repeat(3, 1fr)'; // 3 columns for Zone A
      case 'b':
        return 'repeat(3, 1fr)'; // 3 columns for Zone B
      case 'c':
        return 'repeat(2, 1fr)'; // 2 columns for Zone C
      default:
        return 'repeat(4, 1fr)'; // 4 columns for All Zones
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'available' ? '#10b981' : '#ef4444';
  };

  return (
    <FloorPlanContainer>
      <PageHeader>
        <h1>Floor Plan</h1>
        <p>Interactive restaurant table layout and management</p>
      </PageHeader>

      <Controls>
        <ZoneFilter>
          {zones.map(zone => (
            <ZoneButton
              key={zone.id}
              isActive={selectedZone === zone.id}
              onClick={() => setSelectedZone(zone.id)}
            >
              {zone.name} ({zone.count})
            </ZoneButton>
          ))}
        </ZoneFilter>
      </Controls>

      <FloorPlanSection>
        <FloorPlanContent>
          <ZoneHeader>
            <h2>{zones.find(z => z.id === selectedZone)?.name}</h2>
            <p>{filteredTables.length} tables • {filteredTables.filter(t => t.status === 'available').length} available</p>
          </ZoneHeader>
          
          <FloorPlanGrid gridLayout={getGridLayout()}>
            {filteredTables.map(table => (
              <TableElement
                key={table.id}
                status={table.status}
              >
                <TableNumber>{table.number}</TableNumber>
                <TableCapacity>{table.capacity} seats</TableCapacity>
                <TableStatus status={table.status}>
                  {table.status === 'available' ? 'Available' : 'Occupied'}
                </TableStatus>
              </TableElement>
            ))}
          </FloorPlanGrid>
        </FloorPlanContent>

        <FloorPlanLegend>
          <LegendTitle>Table Status</LegendTitle>
          <LegendGrid>
            <LegendItem>
              <LegendDot color="#10b981" />
              <span>Available</span>
            </LegendItem>
            <LegendItem>
              <LegendDot color="#ef4444" />
              <span>Occupied</span>
            </LegendItem>
          </LegendGrid>
          
          <LegendTitle style={{ marginTop: '2rem' }}>Zone Information</LegendTitle>
          <ZoneInfo>
            <ZoneInfoItem>
              <ZoneLabel>Zone A - Window:</ZoneLabel>
              <ZoneDescription>Window-side tables with natural light</ZoneDescription>
            </ZoneInfoItem>
            <ZoneInfoItem>
              <ZoneLabel>Zone B - Center:</ZoneLabel>
              <ZoneDescription>Central area with larger tables</ZoneDescription>
            </ZoneInfoItem>
            <ZoneInfoItem>
              <ZoneLabel>Zone C - Garden:</ZoneLabel>
              <ZoneDescription>Outdoor garden seating area</ZoneDescription>
            </ZoneInfoItem>
          </ZoneInfo>
        </FloorPlanLegend>
      </FloorPlanSection>
    </FloorPlanContainer>
  );
};

const FloorPlanContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
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

const Controls = styled.div`
  margin-bottom: 2rem;
`;

const ZoneFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ZoneButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.isActive ? '#06b6d4' : '#e2e8f0'};
  background: ${props => props.isActive ? '#06b6d4' : 'white'};
  color: ${props => props.isActive ? 'white' : '#64748b'};
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? '#0891b2' : '#f8fafc'};
  }
`;

const FloorPlanSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FloorPlanContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ZoneHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 1rem;
  }
`;

const FloorPlanGrid = styled.div<{ gridLayout: string }>`
  display: grid;
  grid-template-columns: ${props => props.gridLayout};
  gap: 1.5rem;
  padding: 1rem;
  justify-items: center;
`;

const TableElement = styled.div<{ status: string }>`
  width: 120px;
  height: 120px;
  background: ${props => props.status === 'available' ? '#dcfce7' : '#fef2f2'};
  border: 3px solid ${props => props.status === 'available' ? '#bbf7d0' : '#fecaca'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  padding: 0.5rem;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TableNumber = styled.div`
  font-weight: 700;
  color: #1e293b;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const TableCapacity = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const TableStatus = styled.div<{ status: string }>`
  font-size: 0.7rem;
  color: ${props => props.status === 'available' ? '#10b981' : '#ef4444'};
  font-weight: 500;
`;

const FloorPlanLegend = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const LegendTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const LegendGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #64748b;
`;

const LegendDot = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const ZoneInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ZoneInfoItem = styled.div`
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #06b6d4;
`;

const ZoneLabel = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const ZoneDescription = styled.div`
  color: #64748b;
  font-size: 0.8rem;
`;

export default FloorPlanPage;
