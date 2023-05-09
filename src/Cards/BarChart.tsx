import { useRef } from 'react';
import { Chart, Series } from 'devextreme-react/chart';

import styled from 'styled-components';
import { dataSource } from './data.js';
import ActionTools from './ActionTools';

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

const BarChart = ({ topPx, name, leftPx, widthPx, heightPx, displayState, isPreview }: CardPosition) => {
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
        <span>막대 차트</span>
      </CardTitle>
      <Chart height="90%" width="100%" id="chart" dataSource={dataSource}>
        <Series valueField="oranges" argumentField="day" name="My oranges" type="bar" color="#ffaa66" />
      </Chart>
    </CardBoard>
  );
};

export default BarChart;
