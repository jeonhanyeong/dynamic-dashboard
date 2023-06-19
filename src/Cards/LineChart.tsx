import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  Legend,
  Margin,
  Tooltip,
  Grid,
  ValueAxis,
} from 'devextreme-react/chart';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { encode } from 'base-64';
import styled from 'styled-components';
import ActionTools from './ActionTools';

const CardBoard = styled.div`
  border: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  box-sizing: border-box;
  padding: 10px;
  background-color: ${(props) => props.theme.cardBackColor};
  position: absolute;
  border-radius: 2px;

  transition: height 125ms linear 125ms, width 125ms linear 0s, top 175ms ease-out, left 175ms ease-out,
    right 175ms ease-out;
  z-index: 991;
  min-height: 84px;
  min-width: 84px;
`;

const CardTitle = styled.div`
  width: 100%;
  height: auto;
  background-color: none;
  font-size: 14px;
  font-weight: bold;
  padding-left: 5px;
`;

interface apiInfoInterface {
  gateway: string;
  username: string;
  password: string;
}

interface CardPosition {
  topPx: number;
  leftPx: number;
  widthPx: number;
  heightPx: number;
  name: string;
  displayState: string;
  isPreview: boolean;
  handleDelete: ((event: React.MouseEvent) => void) | null;
  handleContext: ((name: string, ratioWidth: number, ratioHeight: number) => void) | null;
  apiInfo: apiInfoInterface;
  isDarkMode: boolean;
  handleTileSettingVisible: (cardName: string) => void;
}

const LineChart = ({
  isDarkMode,
  topPx,
  name,
  leftPx,
  widthPx,
  heightPx,
  displayState,
  isPreview,
  handleDelete,
  handleContext,
  handleTileSettingVisible,
  apiInfo,
}: CardPosition) => {
  const credentials = encode(`${apiInfo.username}:${apiInfo.password}`);
  const basicAuth = `Basic ${credentials}`;
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(991);
  const [applicationData, setApplicationData] = useState({});
  const paletteaa = ['#1976D2',  '#10B5E8', '#464EB8', '#10DED8','#D1382E', '#DB9827'];

  const applicationSources = [
    { value: 'Billing', name: 'Billing' },
    { value: 'SalesOps', name: 'SalesOps' },
    { value: 'colson', name: 'colson' },
    { value: 'iam', name: 'iam' },
    { value: 'matecdn_back', name: 'matecdn_back' },
    { value: 'matecdn_front', name: 'matecdn_front' },
  ];

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };

  const getData = () => {
    axios
      .get(`${apiInfo.gateway}iam/metric/login/application/date`, {
        headers: {
          Authorization: basicAuth,
        },
        params: {
          date: 20,
        },
      })
      .then((response) => {
        setApplicationData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  
  }, []);

  return (
    <CardBoard
      ref={cardBoardRef}
      className={name}
      key={name}
      style={{
        top: topPx,
        left: leftPx,
        width: widthPx,
        height: heightPx,
        display: displayState,
        cursor: isPreview ? 'auto' : 'move',
        zIndex: depth,
      }}
      draggable
    >
      {isPreview ? null : (
        <ActionTools
          name={name}
          handleDelete={handleDelete}
          handleSelectCard={handleSelectCard}
          handleContext={handleContext}
          handleTileSettingVisible={handleTileSettingVisible}
        />
      )}

      <CardTitle>
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000' }}>최근 20일 간 일자별 애플리케이션별 접속 수</span>
        <div>
          <span style={{ color: isDarkMode ? '#6F6E6D' : 'gray', fontSize: '12px', fontWeight: 'normal' }}>
            Number of connections by application in the last 20 days
          </span>
        </div>
      </CardTitle>
      <div style={{ height: '95%', width: '100%' }}>
        <Chart height="100%" width="100%" dataSource={applicationData} palette={paletteaa}>
          <CommonSeriesSettings argumentField="date" />
          {applicationSources.map((item) => (
            <Series key={item.value} valueField={item.value} name={item.name} />
          ))}
          <Margin bottom={20} />
          <ArgumentAxis valueMarginsEnabled discreteAxisDivisionMode="crossLabels">
            <Grid visible color={isDarkMode ? '#6F6E6D' : '#e2e2e2'} />
          </ArgumentAxis>
          <ValueAxis>
            <Grid visible color={isDarkMode ? '#6F6E6D' : '#e2e2e2'}/>
          </ValueAxis>
          <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="bottom" />
          <Tooltip enabled />
        </Chart>
      </div>
    </CardBoard>
  );
};

export default LineChart;
