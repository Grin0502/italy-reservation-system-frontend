import styled from "styled-components";
import { Link } from "react-router-dom";

import Logo from "../../components/public/Logo";

const Header = () => {
    return (
        <Wrapper>
            <Container>
                <Logo />
                <Navbar>
                    <NavItem to="/">Home</NavItem>
                    <NavItem to="/about">About</NavItem>
                    <NavItem to="/services">Services</NavItem>
                    <NavItem to="/contact">Contact</NavItem>
                </Navbar>
            </Container>
        </Wrapper>      
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.9);
    height: 64px;
`;
const Container = styled.div`
    max-width: 1536px;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: blur(10px);
`;
const Navbar = styled.div`
    display: flex;
    gap: 16px;
`;
const NavItem = styled(Link)`
    color: rgb(209 213 219);
    transition: color 0.3s;

    &:hover {
        color: rgb(255 255 255);
    }
`;
export default Header;