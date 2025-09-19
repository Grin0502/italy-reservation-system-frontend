import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { 
  AiOutlineHome,
  AiOutlineLayout,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineClockCircle,
  AiOutlineAppstore,
  AiOutlineClose
} from "react-icons/ai";
import { useUser } from "../../contexts/UserContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { hasPermission } = useUser();

  const navItems = [
    { path: "/", label: "Home", icon: AiOutlineHome, permission: null }, // Always visible
    { path: "/floor-plan", label: "Table Management", icon: AiOutlineLayout, permission: "manage_tables" },
    { path: "/zone-management", label: "Zone Management", icon: AiOutlineAppstore, permission: "manage_zones" },
    { path: "/booking-demo", label: "Booking Demo", icon: AiOutlineClockCircle, permission: null }, // Always visible
    { path: "/statistics", label: "Statistics", icon: AiOutlineBarChart, permission: "view_statistics" },
    { path: "/settings", label: "Settings", icon: AiOutlineSetting, permission: "manage_restaurant_info" },
  ];

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => {
    if (!item.permission) return true; // Always show items without permission requirement
    return hasPermission(item.permission);
  });

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarContent>
        <LogoSection>
          <Logo>Restaurant Manager</Logo>
          <CloseButton onClick={onClose}>
            <AiOutlineClose />
          </CloseButton>
        </LogoSection>
        
        <NavSection>
          {filteredNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavItem 
                key={item.path} 
                to={item.path}
                isActive={isActive}
                onClick={onClose}
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

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 250px;
  height: 100vh;
  background: #1e293b;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  
  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const LogoSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #334155;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
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
