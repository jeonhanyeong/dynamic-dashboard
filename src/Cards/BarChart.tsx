import { useRef, useState, useEffect } from 'react';
import { Chart, Series, Export, Legend, Tooltip, ValueAxis, Grid } from 'devextreme-react/chart';
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

interface dataInterface {
  clientId: string;
  username: string;
  eventDate: string;
}
interface MyObject {
  month: string;
  count: number;
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
  handleTileSettingVisible,
  apiInfo,
  isDarkMode,
}: CardPosition) => {
  const dataSource = [
    {
      month: '1월',
      count: 3,
    },
    {
      month: '2월',
      count: 2,
    },
    {
      month: '3월',
      count: 3,
    },
    {
      month: '4월',
      count: 4,
    },
    {
      month: '5월',
      count: 6,
    },
  ];

  const credentials = encode(`${apiInfo.username}:${apiInfo.password}`);
  const basicAuth = `Basic ${credentials}`;
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(991);
  const [chartDataSource, setChartDataSource] = useState<MyObject[]>([]);

  const barChartData: MyObject[] = [];

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };

  const getData = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 150));
    const datayear = thirtyDaysAgo.getFullYear();
    const datamonth = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
    const dataday = String(thirtyDaysAgo.getDate()).padStart(2, '0');

    const formattedDate = `${datayear}-${datamonth}-${dataday}`;

    axios
      .get(`${apiInfo.gateway}iam/metric/login/application/log`, {
        headers: {
          Authorization: basicAuth,
        },
        params: {
          date: formattedDate,
        },
      })
      .then((response) => {
        const { data } = response;
        const groupedData = data.reduce((result: { [key: string]: typeof data }, item: dataInterface) => {
          const date = new Date(item.eventDate);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const key = `${year}-${month}`;

          const updatedResult = { ...result };
          updatedResult[key] = updatedResult[key] ?? [];
          updatedResult[key].push(item);
          return updatedResult;
        }, {});

        const keyValue = Object.keys(groupedData);
        keyValue.forEach((key) => {
          const obj: MyObject = {
            month: '',
            count: 0,
          };
          const value = groupedData[key];
          const uniqueUserCount = new Set(value.map((item: any) => item.username));
          obj.month = key;
          obj.count = uniqueUserCount.size;
          barChartData.push(obj);
        });
        setChartDataSource(barChartData);
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
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000' }}>최근 5개월 간 월별 활성 유저 수</span>
        <div>
          <span style={{ color: isDarkMode ? '#6F6E6D' : 'gray', fontSize: '12px', fontWeight: 'normal' }}>
            MAU by month in the last 5 months
          </span>
        </div>
      </CardTitle>
      <Chart height="92%" width="100%" id="chart" dataSource={chartDataSource}>
        <Series valueField="count" argumentField="month" name="MAU" type="bar" color="#4EBEF0" />
        <Tooltip enabled />
        <ValueAxis>
            <Grid visible color={isDarkMode ? '#6F6E6D' : '#e2e2e2'}/>
          </ValueAxis>
        <Legend verticalAlignment="bottom" horizontalAlignment="center" />
      </Chart>
    </CardBoard>
  );
};

// <Export enabled backgroundColor={isDarkMode ? '#000' : '#EDECEB'}/>
export default BarChart;
