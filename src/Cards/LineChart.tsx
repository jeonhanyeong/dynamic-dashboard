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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import service from './data.js';

const countriesInfo = service.getCountriesInfo();
const energySources = service.getEnergySources();

const CardBoard = styled.div`
  border: 1px solid #e1dfdd;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  width: 535px;
  height: 355px;
  box-sizing: border-box;
  padding: 10px;
  background-color: white;
  display: block;
  position: absolute;
  border-radius: 2px;
  cursor: move;
  transition: height 125ms linear 125ms, width 125ms linear 0s, top 175ms ease-out, left 175ms ease-out,
    right 175ms ease-out;
`;

const Cover = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  opacity: 0.5;
  background-color: white;
  z-index: 998;
  position: absolute;
  display: block;
`;

const ResizeHandle = styled.div`
  height: 14px;
  width: 14px;
  bottom: 0px;
  display: block;
  padding: 0px 4px 4px 0px;
  right: 0px;
  position: absolute;
  cursor: se-resize;
  z-index: 999;
`;

const Equip = styled.div`
  height: 12px;
  width: 12px;
  display: block;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
  z-index: 999;
  cursor: se-resize;
`;

const ActionBar = styled.div`
  width: 100%;
  z-index: 999;
  height: 25px;
  background-color: none;
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  justify-content: right;
  box-sizing: border-box;
`;

const DeleteComponent = styled.div`
  width: 25px;
  height: 100%;
  background-color: none;
  &:hover {
    background-color: #a52121;
    color: white;
  }
  cursor: pointer;
  padding: 2px;
  box-sizing: border-box;
`;

const ActionMenu = styled.div`
  width: 25px;
  height: 100%;
  background-color: none;
  &:hover {
    background-color: #bcbcbc;
  }
  cursor: pointer;
  box-sizing: border-box;
  padding: 2px;
`;

const CardTitle = styled.div`
  width: 100%;
  height: auto;
  background-color: none;
  font-size: 14px;
  font-weight: bold;
  padding-left: 5px;
`;

type LineChartPosition = {
  topPx: number;
  leftPx: number;
};

const LineChart = ({ topPx, leftPx }: LineChartPosition) => {
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const handleMouseEnter = (event: React.MouseEvent) => {
    console.log(event.target);
    const enteredElement = event.target as HTMLDivElement;
    // enteredElement.style.opacity = '0';
    if (actionBarRef.current && coverRef.current) {
      actionBarRef.current.style.display = 'flex';
      coverRef.current.style.opacity = '0';
    }
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    const enteredElement = event.target as HTMLDivElement;
    // enteredElement.style.opacity = '0.5';
    if (actionBarRef.current && coverRef.current) {
      actionBarRef.current.style.display = 'none';
      coverRef.current.style.opacity = '0.5';
    }
  };

  return (
    <CardBoard
      ref={cardBoardRef}
      className="Card"
      style={{ top: topPx, left: leftPx }}
      draggable
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ActionBar ref={actionBarRef}>
        <DeleteComponent>
          <DeleteOutlineOutlinedIcon style={{ color: 'gray' }} fontSize="small" />
        </DeleteComponent>
        <ActionMenu>
          <MoreHorizOutlinedIcon style={{ color: 'gray' }} fontSize="small" />
        </ActionMenu>
      </ActionBar>
      <Cover ref={coverRef} className="Card-Cover" />
      <CardTitle>
        <span>라인 차트</span>
      </CardTitle>
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
      <ResizeHandle>
        <Equip />
      </ResizeHandle>
    </CardBoard>
  );
};

export default LineChart;
