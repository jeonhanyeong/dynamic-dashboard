import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  Export,
  Legend,
  Margin,
  Title,
  Subtitle,
  Tooltip,
  Grid,
} from 'devextreme-react/chart';

import { useRef } from 'react';
import styled from 'styled-components';
import service from './data.js';
import ActionTools from './ActionTools';

const countriesInfo = service.getCountriesInfo();
const energySources = service.getEnergySources();

const CardBoard = styled.div`
  border: 1px solid #e1dfdd;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  box-sizing: border-box;
  padding: 10px;
  background-color: white;
  position: absolute;
  border-radius: 2px;

  transition: height 125ms linear 125ms, width 125ms linear 0s, top 175ms ease-out, left 175ms ease-out,
    right 175ms ease-out;
  z-index: 991;
  min-height: 90px;
  min-width: 90px;
`;

const CardTitle = styled.div`
  width: 100%;
  height: auto;
  background-color: none;
  font-size: 14px;
  font-weight: bold;
  padding-left: 5px;
`;

interface CardPosition {
  topPx: number;
  leftPx: number;
  widthPx: number;
  heightPx: number;
  name: string;
  displayState: string;
  isPreview: boolean;
}

const LineChart = ({ topPx, name, leftPx, widthPx, heightPx, displayState, isPreview }: CardPosition) => {
  const cardBoardRef = useRef<HTMLDivElement>(null);

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
      }}
      draggable
    >
      {isPreview ? null : <ActionTools />}

      <CardTitle>
        <span>라인 차트</span>
      </CardTitle>
      <div style={{ height: '100%', width: '100%' }}>
        <Chart height="100%" width="100%" dataSource={countriesInfo}>
          <CommonSeriesSettings argumentField="country" />
          {energySources.map((item) => (
            <Series key={item.value} valueField={item.value} name={item.name} />
          ))}
          <Margin bottom={20} />
          <ArgumentAxis valueMarginsEnabled={false} discreteAxisDivisionMode="crossLabels">
            <Grid visible />
          </ArgumentAxis>
          <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="bottom" />
          <Export enabled />
          <Title text="Energy Consumption in 2004">
            <Subtitle text="(Millions of Tons, Oil Equivalent)" />
          </Title>
          <Tooltip enabled />
        </Chart>
      </div>
    </CardBoard>
  );
};

export default LineChart;
