import styled from 'styled-components';
import lightMode from '../assets/images/lightDashboard.png';
import darkMode from '../assets/images/darkDashboard.png';

const Setting = styled.div`
  position: absolute;
  right: 0;
  background-color: white;
  width: 200px;
  height: 200px;
  display: flex;
  z-index: 1000;
  padding: 15px;
  border: 1px solid lightgray;
`;
const LightMode = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${lightMode});
  background-size: cover;
  padding: 15px;
`;

const lightImg = styled.div``;

const DarkMode = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${darkMode});
  background-size: cover;
`;

const ModeSetting = () => {
  return (
    <Setting>
      <LightMode />
      <DarkMode />
    </Setting>
  );
};

export default ModeSetting;
