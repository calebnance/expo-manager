import styled from 'styled-components';

const brandPrimary = '#4630eb';
const brandPrimaryHover = '#837ef7';

const Button = styled.button`
  align-items: center;
  background-color: ${brandPrimary};
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  display: flex;
  height: 46px;
  justify-content: center;
  margin-right: 8px;
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

const Container = styled.div`
  margin: 0 auto;
  min-width: 720px;
  max-width: 1024px;
`;

const ContainerFlexEnd = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 720px;
`;

const NavBar = styled(ContainerFlexEnd)`
  margin: 16px;
`;

export { Button, Container, ContainerFlexEnd, NavBar };
