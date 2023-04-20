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

type LineChartPosition = {
  topPx: number;
  leftPx: number;
};

const LineChart = (props: LineChartPosition) => {
  const { topPx, leftPx } = props;

  return (
    <CardBoard style={{ top: topPx, left: leftPx }} draggable>
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
