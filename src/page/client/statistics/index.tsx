import styled from "styled-components";
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
} from "recharts";

const StatisticsPage = () => {
  // Mock data for charts
  const occupancyData = [
    { day: 'Mon', occupancy: 65, bookings: 45 },
    { day: 'Tue', occupancy: 72, bookings: 52 },
    { day: 'Wed', occupancy: 68, bookings: 48 },
    { day: 'Thu', occupancy: 85, bookings: 62 },
    { day: 'Fri', occupancy: 92, bookings: 78 },
    { day: 'Sat', occupancy: 95, bookings: 85 },
    { day: 'Sun', occupancy: 78, bookings: 65 },
  ];

  const bookingSources = [
    { name: 'Phone', value: 45, color: '#06b6d4' },
    { name: 'Website', value: 30, color: '#3b82f6' },
    { name: 'Walk-in', value: 15, color: '#10b981' },
    { name: 'App', value: 10, color: '#f59e0b' },
  ];

  const monthlyTrends = [
    { month: 'Jan', revenue: 45000, bookings: 320 },
    { month: 'Feb', revenue: 48000, bookings: 340 },
    { month: 'Mar', revenue: 52000, bookings: 380 },
    { month: 'Apr', revenue: 49000, bookings: 350 },
    { month: 'May', revenue: 55000, bookings: 400 },
    { month: 'Jun', revenue: 58000, bookings: 420 },
  ];

  const quickStats = [
    { label: 'Total Revenue', value: '€45,230', change: '+12%', positive: true },
    { label: 'Avg. Table Turn', value: '2.3h', change: '-5%', positive: false },
    { label: 'No-show Rate', value: '8.5%', change: '-2%', positive: true },
    { label: 'Customer Rating', value: '4.6/5', change: '+0.2', positive: true },
  ];

  return (
    <StatisticsContainer>
      <PageHeader>
        <h1>Statistics & Analytics</h1>
        <p>Key performance metrics and insights</p>
      </PageHeader>

      {/* Quick Stats */}
      <StatsGrid>
        {quickStats.map((stat, index) => (
          <StatCard key={index}>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue>{stat.value}</StatValue>
            <StatChange positive={stat.positive}>
              {stat.change}
            </StatChange>
          </StatCard>
        ))}
      </StatsGrid>

      <ChartsGrid>
        {/* Weekly Occupancy */}
        <ChartCard>
          <ChartHeader>
            <h3>Weekly Occupancy & Bookings</h3>
            <p>Last 7 days performance</p>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="occupancy" fill="#06b6d4" name="Occupancy %" />
              <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Booking Sources */}
        <ChartCard>
          <ChartHeader>
            <h3>Booking Sources</h3>
            <p>Distribution by channel</p>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingSources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bookingSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Trends */}
        <ChartCard fullWidth>
          <ChartHeader>
            <h3>Monthly Revenue & Bookings Trend</h3>
            <p>6-month performance overview</p>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#06b6d4" name="Revenue (€)" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#10b981" name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </StatisticsContainer>
  );
};

const StatisticsContainer = styled.div`
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

export default StatisticsPage;
