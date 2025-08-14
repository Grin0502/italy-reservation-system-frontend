import styled from "styled-components";

interface LogoProps {
    LogoSize?: string;
}
const Logo = ({ LogoSize = "24px" }: LogoProps) => {
    return (
        <LogoContainer>
            <LogoText fontSize={LogoSize}>Tavly</LogoText>
        </LogoContainer>
    );
};

const LogoContainer = styled.div`
`;
const LogoText = styled.div<{ fontSize: string }>`
    font-size: ${props => props.fontSize};
    font-weight: bold;
    color: transparent;
    background-clip: text;
    background-image: linear-gradient(to right, #22d3ee , #3b82f6);
`;

export default Logo;