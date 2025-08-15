import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";

const FloorPlanPage = () => {
  const [selectedZone, setSelectedZone] = useState('all');

  const zones = [
    { id: 'all', name: 'All Zones', count: 12 },
    { id: 'a', name: 'Zone A', count: 4 },
    { id: 'b', name: 'Zone B', count: 4 },
    { id: 'c', name: 'Zone C', count: 4 },
  ];

  const tables = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    number: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
    status: i % 3 === 0 ? 'occupied' : 'available',
    capacity: [2, 4, 6, 8][i % 4]
  }));

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
          <FloorPlanGrid>
            {tables.map(table => (
              <TableElement
                key={table.id}
                status={table.status}
              >
                <TableNumber>{table.number}</TableNumber>
                <TableCapacity>{table.capacity}</TableCapacity>
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

const FloorPlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 2rem;
`;

const TableElement = styled.div<{ status: string }>`
  width: 100px;
  height: 100px;
  background: ${props => props.status === 'available' ? '#dcfce7' : '#fef2f2'};
  border: 3px solid ${props => props.status === 'available' ? '#bbf7d0' : '#fecaca'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TableNumber = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
`;

const TableCapacity = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
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

export default FloorPlanPage;
