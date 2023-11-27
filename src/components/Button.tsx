import styled from 'styled-components'

const Button = styled.button`
  background: linear-gradient(145deg, #9575cd, #6c43ab); /* Subtle gradient */
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  border: none;
  border-radius: 16px; /* More pronounced rounded corners */
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Soft shadow for depth */

  &:hover {
    background: linear-gradient(145deg, #a188d6, #7e57c2); /* Darker gradient for hover */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Larger shadow for lifted effect */
  }

  &:active {
    background: linear-gradient(145deg, #7e57c2, #6c43ab); /* Even darker for active state */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Small shadow to simulate pressing down */
  }
`;

export default Button;