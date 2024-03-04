import styled from 'styled-components'
import { responsiveSize } from 'styles/responsiveSize'

const Button = styled.button`
  display: flex;
  background: linear-gradient(145deg, #9575cd, #6c43ab);
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 8px ${responsiveSize(8, 20)};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #6c43ab;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    background: #6c43ab;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`

export default Button
