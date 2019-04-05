import styled from 'styled-components';

const brandPrimary = '#4630eb';
const brandPrimaryHover = '#837ef7';

export const Button = styled.button`
  align-items: center;
  background-color: ${brandPrimary};
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  display: flex;
  height: 46px;
  justify-content: center;
  margin: 0 4px;
  min-width: 180px;
  padding: 10px;

  svg {
    flex: none;
    margin-left: ${props => props.svgML || '0'}
    margin-right: ${props => props.svgMR || '0'}
  }

  &:hover {
    background-color: ${brandPrimaryHover};
  }
`;

export const Container = styled.div`
  margin: 0 auto;
  max-width: 1024px;
`;

export const ContainerFlexEnd = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
