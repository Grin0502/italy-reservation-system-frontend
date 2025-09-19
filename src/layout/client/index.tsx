import styled from "styled-components";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";

const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainContent>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <PageContent>
          <Outlet />
        </PageContent>
        <Footer />
      </MainContent>
      {sidebarOpen && <Overlay onClick={() => setSidebarOpen(false)} />}
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const PageContent = styled.main`
  flex: 1;
  padding: 2rem;
  background: #f8fafc;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 30;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export default ClientLayout;