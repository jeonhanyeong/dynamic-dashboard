import styled from 'styled-components';

const EditDashboard = styled.div`
  z-index: 990;
  width: 100%;
  height: 100%;
  padding: 16px 40px;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
  display: block;
  flex-basis: auto;
  flex-grow: 1;
  flex-shrink: 1;
  box-sizing: border-box;
`;

const TileGrid = styled.div`
  display: block;

  background-image: url(https://portal.azure.com/Content/Static//MsPortalImpl/General/FlowLayout_gridShadow.png);
  background-attachment: scroll;
  width: 3865px;
  height: 2155px;
  min-width: 3865px;
  min-height: 2155px;
  padding-bottom: 25px;
  padding-right: 25px;
  position: relative;
  background-clip: border-box;
  background-origin: padding-box;
  background-position-x: 0%;
  background-position-y: 0%;
  background-size: auto;
`;

const DashboardBody = () => {
  return (
    <EditDashboard>
      <TileGrid />
    </EditDashboard>
  );
};

export default DashboardBody;
