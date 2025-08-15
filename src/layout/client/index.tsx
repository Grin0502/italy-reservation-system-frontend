import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";

const ClientLayout = () => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Header />
        <PageContent>
          <Outlet />
        </PageContent>
        <Footer />
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PageContent = styled.main`
  flex: 1;
  padding: 2rem;
  background: #f8fafc;
`;

export default ClientLayout;