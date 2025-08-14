import styled from "styled-components"

const CustomButton = () => {
    return (
        <div></div>
    )
};

const StyledButton = styled.button`
    background-color: #22d3ee;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 16px;
    cursor: pointer;

    &:hover {
        background-color: #3b82f6;
    }
`;

export default CustomButton;