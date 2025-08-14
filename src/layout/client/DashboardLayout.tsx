import styled from "styled-components";
import { useState } from "react";
import { 
  AiOutlineHome, 
  AiOutlineTable, 
  AiOutlineBarChart, 
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineClose
} from "react-icons/ai";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardLayout = ({ children, activeSection, onSectionChange }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: AiOutlineHome },
    { id: 'floor-plan', label: 'Floor Plan', icon: AiOutlineTable },
    { id: 'statistics', label: 'Statistics', icon: AiOutlineBarChart },
    { id: 'settings', label: 'Settings', icon: AiOutlineSetting },
  ];

  return (
    <LayoutContainer>
      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={toggleSidebar}>
        {isSidebarOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </MobileMenuButton>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <Logo>
            <span className="gradient-text">Tavly</span>
          </Logo>
          <Subtitle>Restaurant Dashboard</Subtitle>
        </SidebarHeader>

        <Navigation>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavItem
                key={item.id}
                isActive={activeSection === item.id}
                onClick={() => onSectionChange(item.id)}
              >
                <IconComponent />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </Navigation>

        <SidebarFooter>
          <RestaurantInfo>
            <RestaurantName>Ristorante Bella Vista</RestaurantName>
            <RestaurantStatus>Online</RestaurantStatus>
          </RestaurantInfo>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <MainContent isSidebarOpen={isSidebarOpen}>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MobileMenuButton = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 280px;
  background: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 999;
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid #334155;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  
  .gradient-text {
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem 0;
`;

const NavItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isActive ? '#334155' : 'transparent'};
  border-left: 3px solid ${props => props.isActive ? '#06b6d4' : 'transparent'};
  
  &:hover {
    background: #334155;
  }
  
  svg {
    font-size: 1.25rem;
    color: ${props => props.isActive ? '#06b6d4' : '#94a3b8'};
  }
  
  span {
    color: ${props => props.isActive ? 'white' : '#94a3b8'};
    font-weight: ${props => props.isActive ? '500' : '400'};
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #334155;
`;

const RestaurantInfo = styled.div`
  text-align: center;
`;

const RestaurantName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const RestaurantStatus = styled.div`
  font-size: 0.75rem;
  color: #10b981;
`;

const MainContent = styled.main<{ isSidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${props => props.isSidebarOpen ? '0' : '0'};
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 4rem;
  }
`;

export default DashboardLayout;
