import styled from "styled-components";
import { Link } from "react-router-dom";
import { 
  AiOutlineCalendar, 
  AiOutlineUser, 
  AiOutlineClockCircle,
  AiOutlinePhone,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle
} from "react-icons/ai";

const HomePage = () => {
  // Mock data
  const todayReservations = [
    { id: 1, time: "19:00", name: "Mario Rossi", guests: 4, table: "A1", status: "confirmed" },
    { id: 2, time: "20:30", name: "Giulia Bianchi", guests: 2, table: "B3", status: "pending" },
    { id: 3, time: "21:00", name: "Luca Verdi", guests: 6, table: "C2", status: "confirmed" },
    { id: 4, time: "19:30", name: "Anna Neri", guests: 3, table: "A4", status: "cancelled" },
  ];

  const quickStats = [
    { label: "Today's Bookings", value: "24", icon: AiOutlineCalendar, color: "#06b6d4" },
    { label: "Total Guests", value: "89", icon: AiOutlineUser, color: "#3b82f6" },
    { label: "Avg. Wait Time", value: "12m", icon: AiOutlineClockCircle, color: "#10b981" },
    { label: "Calls Today", value: "15", icon: AiOutlinePhone, color: "#f59e0b" },
  ];

  const recentActivity = [
    { id: 1, type: "booking", message: "New booking confirmed for Table A1", time: "2 min ago", status: "success" },
    { id: 2, type: "call", message: "Incoming call from +39 123 456 789", time: "5 min ago", status: "info" },
    { id: 3, type: "cancellation", message: "Booking cancelled for Table B2", time: "12 min ago", status: "warning" },
    { id: 4, type: "booking", message: "Walk-in customer seated at Table C3", time: "15 min ago", status: "success" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <AiOutlineCheckCircle />;
      case 'cancelled': return <AiOutlineCloseCircle />;
      default: return <AiOutlineClockCircle />;
    }
  };

  return (
    <HomeContainer>
      <PageHeader>
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </PageHeader>

      {/* Quick Stats */}
      <StatsGrid>
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <StatCard key={index}>
              <StatIcon color={stat.color}>
                <IconComponent />
              </StatIcon>
              <StatContent>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatContent>
            </StatCard>
          );
        })}
      </StatsGrid>

      <ContentGrid>
        {/* Today's Reservations */}
        <SectionCard>
          <SectionHeader>
            <h2>Today's Reservations</h2>
            <ViewAllButton as={Link} to="/statistics">View All</ViewAllButton>
          </SectionHeader>
          <ReservationsList>
            {todayReservations.map((reservation) => (
              <ReservationItem key={reservation.id}>
                <ReservationTime>{reservation.time}</ReservationTime>
                <ReservationDetails>
                  <ReservationName>{reservation.name}</ReservationName>
                  <ReservationInfo>
                    {reservation.guests} guests • Table {reservation.table}
                  </ReservationInfo>
                </ReservationDetails>
                <ReservationStatus color={getStatusColor(reservation.status)}>
                  {getStatusIcon(reservation.status)}
                  <span>{reservation.status}</span>
                </ReservationStatus>
              </ReservationItem>
            ))}
          </ReservationsList>
        </SectionCard>

        {/* Mini Floor Plan Preview */}
        <SectionCard>
          <SectionHeader>
            <h2>Floor Plan Overview</h2>
            <ViewAllButton as={Link} to="/floor-plan">View Full Plan</ViewAllButton>
          </SectionHeader>
          <FloorPlanPreview>
            <FloorPlanGrid>
              {Array.from({ length: 12 }, (_, i) => (
                <Table key={i} isOccupied={i % 3 === 0}>
                  <TableNumber>{i + 1}</TableNumber>
                  <TableStatus>{i % 3 === 0 ? 'Occupied' : 'Available'}</TableStatus>
                </Table>
              ))}
            </FloorPlanGrid>
            <FloorPlanLegend>
              <LegendItem>
                <LegendDot color="#10b981" />
                <span>Available</span>
              </LegendItem>
              <LegendItem>
                <LegendDot color="#ef4444" />
                <span>Occupied</span>
              </LegendItem>
            </FloorPlanLegend>
          </FloorPlanPreview>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard fullWidth>
          <SectionHeader>
            <h2>Recent Activity</h2>
          </SectionHeader>
          <ActivityList>
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} status={activity.status}>
                <ActivityIcon status={activity.status}>
                  {activity.type === 'booking' && <AiOutlineCalendar />}
                  {activity.type === 'call' && <AiOutlinePhone />}
                  {activity.type === 'cancellation' && <AiOutlineCloseCircle />}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityMessage>{activity.message}</ActivityMessage>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </SectionCard>
      </ContentGrid>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
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
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.color}15;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.div<{ fullWidth?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #06b6d4;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ReservationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReservationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
  }
`;

const ReservationTime = styled.div`
  font-weight: 600;
  color: #1e293b;
  min-width: 60px;
`;

const ReservationDetails = styled.div`
  flex: 1;
`;

const ReservationName = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ReservationInfo = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const ReservationStatus = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.color};
  font-weight: 500;
  
  svg {
    font-size: 1rem;
  }
`;

const FloorPlanPreview = styled.div``;

const FloorPlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Table = styled.div<{ isOccupied: boolean }>`
  aspect-ratio: 1;
  background: ${props => props.isOccupied ? '#fef2f2' : '#f0fdf4'};
  border: 2px solid ${props => props.isOccupied ? '#fecaca' : '#bbf7d0'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
`;

const TableNumber = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
`;

const TableStatus = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
`;

const FloorPlanLegend = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
`;

const LegendDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
  }
`;

const ActivityIcon = styled.div<{ status: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: ${props => {
    switch (props.status) {
      case 'success': return '#dcfce7';
      case 'warning': return '#fef3c7';
      case 'info': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'success': return '#16a34a';
      case 'warning': return '#d97706';
      case 'info': return '#2563eb';
      default: return '#6b7280';
    }
  }};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityMessage = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

export default HomePage;
