import styled from "styled-components";
import { useState } from "react";
import { useTableZone } from "../../../contexts/TableZoneContext";

const FloorPlanPage = () => {
  const { tables, zones } = useTableZone();
  const [selectedZone, setSelectedZone] = useState('all');

  // Create zones array with "All Zones" option
  const allZones = [
    { id: 'all', name: 'All Zones', count: tables.length },
    ...zones.map((zone: any) => ({
      id: zone.id,
      name: zone.name,
      count: tables.filter((table: any) => table.zoneId === zone.id).length
    }))
  ];

  // Filter tables based on selected zone
  const filteredTables = selectedZone === 'all' 
    ? tables 
    : tables.filter((table: any) => table.zoneId === selectedZone);

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'available': return '#10b981';
  //     case 'occupied': return '#ef4444';
  //     case 'reserved': return '#f59e0b';
  //     case 'maintenance': return '#6b7280';
  //     default: return '#6b7280';
  //   }
  // };

  const getZoneColor = (zoneId: string) => {
    if (zoneId === 'all') return '#06b6d4';
    const zone = zones.find((z: any) => z.id === zoneId);
    return zone?.color || '#6b7280';
  };

  return (
    <FloorPlanContainer>
      <PageHeader>
        <h1>Floor Plan</h1>
        <p>Interactive restaurant table layout and management</p>
      </PageHeader>

      <Controls>
        <ZoneFilter>
          {allZones.map((zone: any) => (
            <ZoneButton
              key={zone.id}
              isActive={selectedZone === zone.id}
              onClick={() => setSelectedZone(zone.id)}
              zoneColor={getZoneColor(zone.id)}
            >
              {zone.name} ({zone.count})
            </ZoneButton>
          ))}
        </ZoneFilter>
      </Controls>

      <FloorPlanSection>
        <FloorPlanContent>
          {filteredTables.length > 0 ? (
            <FloorPlanGrid>
              {filteredTables.map((table: any) => {
                const zone = zones.find((z: any) => z.id === table.zoneId);
                return (
                  <TableElement
                    key={table.id}
                    status={table.status}
                    zoneColor={zone?.color || '#6b7280'}
                  >
                    <TableNumber>{table.number}</TableNumber>
                    <TableCapacity>{table.capacity} seats</TableCapacity>
                    <TableZone>{zone?.name}</TableZone>
                  </TableElement>
                );
              })}
            </FloorPlanGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>🪑</EmptyIcon>
              <EmptyTitle>No tables found</EmptyTitle>
              <EmptyDescription>
                {selectedZone === 'all' 
                  ? 'No tables are currently configured.' 
                  : 'No tables are assigned to this zone.'}
              </EmptyDescription>
            </EmptyState>
          )}
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
            <LegendItem>
              <LegendDot color="#f59e0b" />
              <span>Reserved</span>
            </LegendItem>
            <LegendItem>
              <LegendDot color="#6b7280" />
              <span>Maintenance</span>
            </LegendItem>
          </LegendGrid>
          
          <LegendDivider />
          
          <LegendTitle>Zone Colors</LegendTitle>
          <LegendGrid>
            {zones.map((zone: any) => (
              <LegendItem key={zone.id}>
                <LegendDot color={zone.color} />
                <span>{zone.name}</span>
              </LegendItem>
            ))}
          </LegendGrid>
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

const ZoneButton = styled.button<{ isActive: boolean; zoneColor: string }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.isActive ? props.zoneColor : '#e2e8f0'};
  background: ${props => props.isActive ? props.zoneColor : 'white'};
  color: ${props => props.isActive ? 'white' : '#64748b'};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? props.zoneColor : '#f8fafc'};
    border-color: ${props => props.zoneColor};
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
  min-height: 400px;
`;

const FloorPlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const TableElement = styled.div<{ status: string; zoneColor: string }>`
  width: 100%;
  min-height: 120px;
  background: ${props => {
    switch (props.status) {
      case 'available': return '#dcfce7';
      case 'occupied': return '#fef2f2';
      case 'reserved': return '#fef3c7';
      case 'maintenance': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  border: 3px solid ${props => {
    switch (props.status) {
      case 'available': return '#bbf7d0';
      case 'occupied': return '#fecaca';
      case 'reserved': return '#fed7aa';
      case 'maintenance': return '#d1d5db';
      default: return '#d1d5db';
    }
  }};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: 12px;
    height: 12px;
    background: ${props => props.zoneColor};
    border-radius: 50%;
  }
`;

const TableNumber = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const TableCapacity = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const TableZone = styled.div`
  font-size: 0.625rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
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
  margin-bottom: 1.5rem;
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

const LegendDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 1.5rem 0;
`;

export default FloorPlanPage;
