import { useRef, useState } from 'react';
import { Chart, Series } from 'devextreme-react/chart';

import styled from 'styled-components';
import ActionTools from './ActionTools';
import { dataSource } from './data.js';

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
}

const BarChart = ({
  topPx,
  name,
  leftPx,
  widthPx,
  heightPx,
  displayState,
  isPreview,
  handleDelete,
  handleContext,
}: CardPosition) => {
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(991);

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };
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
        />
      )}
      <CardTitle>
        <span>최근 5개월 간 월별 활성 유저 수</span>
      </CardTitle>
      <Chart height="90%" width="100%" id="chart" dataSource={dataSource}>
        <Series valueField="oranges" argumentField="day" name="My oranges" type="bar" color="#ffaa66" />
      </Chart>
    </CardBoard>
  );
};

export default BarChart;
