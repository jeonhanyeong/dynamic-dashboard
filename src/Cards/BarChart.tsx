import { Chart, Series } from 'devextreme-react/chart';
import styled from 'styled-components';
import { dataSource } from './data.js';

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
`;

const Cover = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  background-color: none;
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

const BarChart = () => {
  return (
    <CardBoard className="Card" style={{ top: '300px', left: '300px' }} draggable>
      <Cover className="Card-Cover" />
      <Chart height="100%" width="100%" id="chart" dataSource={dataSource}>
        <Series valueField="oranges" argumentField="day" name="My oranges" type="bar" color="#ffaa66" />
      </Chart>
      <ResizeHandle>
        <Equip />
      </ResizeHandle>
    </CardBoard>
  );
};

export default BarChart;
