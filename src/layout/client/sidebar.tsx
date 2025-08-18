import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { 
  AiOutlineHome,
  AiOutlineLayout,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineClockCircle
} from "react-icons/ai";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: AiOutlineHome },
    { path: "/floor-plan", label: "Floor Plan", icon: AiOutlineLayout },
    { path: "/booking-demo", label: "Booking Demo", icon: AiOutlineClockCircle },
    { path: "/statistics", label: "Statistics", icon: AiOutlineBarChart },
    { path: "/settings", label: "Settings", icon: AiOutlineSetting },
  ];

  return (
    <SidebarContainer>
      <SidebarContent>
        <LogoSection>
          <Logo>Restaurant Manager</Logo>
        </LogoSection>
        
        <NavSection>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavItem 
                key={item.path} 
                to={item.path}
                isActive={isActive}
              >
                <NavIcon>
                  <IconComponent />
                </NavIcon>
                <NavLabel>{item.label}</NavLabel>
              </NavItem>
            );
          })}
        </NavSection>
      </SidebarContent>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #1e293b;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const LogoSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #334155;
`;

const Logo = styled.div`
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
`;

const NavSection = styled.nav`
  flex: 1;
  padding: 1rem 0;
`;

const NavItem = styled(Link)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${props => props.isActive ? 'white' : '#94a3b8'};
  text-decoration: none;
  transition: all 0.2s ease;
  background: ${props => props.isActive ? '#06b6d4' : 'transparent'};
  margin: 0.25rem 0.75rem;
  border-radius: 8px;
  
  &:hover {
    background: ${props => props.isActive ? '#0891b2' : '#334155'};
    color: white;
  }
`;

const NavIcon = styled.div`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
`;

const NavLabel = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
`;

export default Sidebar;
