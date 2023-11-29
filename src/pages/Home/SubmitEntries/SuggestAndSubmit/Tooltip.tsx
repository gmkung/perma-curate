import React from 'react'
import styled from 'styled-components'

const TooltipContainer = styled.div`
  position: absolute;
  background-color: #87ceeb;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  z-index: 100;
  top: 100%;
  left: 60%;
  transform: translateX(-50%);
  width: 320px;
`

interface ITooltipProps {
  children: React.ReactNode
}

const Tooltip: React.FC<ITooltipProps> = ({ children }) => {
  return <TooltipContainer>{children}</TooltipContainer>
}

export default Tooltip
