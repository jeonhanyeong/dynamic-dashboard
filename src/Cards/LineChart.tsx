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
  box-sizing: border-box;
  padding: 10px;
  background-color: white;
  position: absolute;
  border-radius: 2px;
  cursor: move;
  transition: height 125ms linear 125ms, width 125ms linear 0s, top 175ms ease-out, left 175ms ease-out,
    right 175ms ease-out;
  z-index: 991;
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
  min-height: 90px;
  min-width: 90px;
`;

const ResizeHandle = styled.div`
  height: 10px;
  width: 10px;
  bottom: 5px;
  display: block;
  right: 5px;
  position: absolute;
  cursor: se-resize;
  z-index: 999;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
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

const ResizePlaceHolder = styled.div`
  z-index: 1;
  position: absolute;
  background-color: gray;
  box-sizing: border-box;
  opacity: 0.5;
  cursor: se-resize;
`;

const TestDiv = styled.div`
  border: 1px solid #e1dfdd;
  border-radius: 2px;
  z-index: 2;
  position: absolute;
  background-color: white;
  box-sizing: border-box;
  min-height: 90px;
  min-width: 90px;
`;

type LineChartPosition = {
  topPx: number;
  leftPx: number;
};

const LineChart = ({ topPx, leftPx }: LineChartPosition) => {
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const resizeCardRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [cardDisplay, setCardDisplay] = useState('block');
  const [componentSize, setComponentSize] = useState({ compWidth: 535, compHeight: 355 });
  const [previewSize, setPreviewSize] = useState({ previewWidth: 0, previewHeight: 0 });
  const [placeholderSize, setPlaceholderSize] = useState({ placeholderWidth: 0, placeholderHeight: 0 });

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (actionBarRef.current && coverRef.current) {
      actionBarRef.current.style.display = 'flex';
      coverRef.current.style.opacity = '0';
    }
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    if (actionBarRef.current && coverRef.current) {
      actionBarRef.current.style.display = 'none';
      coverRef.current.style.opacity = '0.5';
    }
  };

  const startResize = (downEvent: React.MouseEvent) => {
    setCardDisplay('none');
    setIsResizing(true);
    setPreviewSize((prev) => ({
      ...prev,
      previewWidth: componentSize.compWidth,
      previewHeight: componentSize.compHeight,
    }));
    setPlaceholderSize((prev) => ({
      ...prev,
      placeholderWidth: componentSize.compWidth,
      placeholderHeight: componentSize.compHeight,
    }));
  };

  // Azure 에서는 화면 전체에 된다..?
  const resizeMouseMove = (moveEvent: React.MouseEvent) => {
    if (!isResizing) return;
    const placeholder = placeholderRef.current as HTMLDivElement;
    const resizeCard = resizeCardRef.current as HTMLDivElement;
    const updatedWidth = Math.round(moveEvent.clientX - resizeCard.getBoundingClientRect().left);
    const updatedHeight = Math.round(moveEvent.clientY - resizeCard.getBoundingClientRect().top);

    if (placeholderSize.placeholderHeight < previewSize.previewHeight) {
      setPlaceholderSize((prev) => ({
        ...prev,
        placeholderHeight: componentSize.compHeight + 90,
      }));
    } else if (placeholderSize.placeholderHeight - previewSize.previewHeight >= 90) {
      setPlaceholderSize((prev) => ({
        ...prev,
        placeholderHeight: componentSize.compHeight - 90,
      }));
    } else if (placeholderSize.placeholderWidth < previewSize.previewWidth) {
      setPlaceholderSize((prev) => ({
        ...prev,
        placeholderWidth: componentSize.compWidth + 90,
      }));
    } else if (placeholderSize.placeholderWidth - previewSize.previewWidth >= 90) {
      setPlaceholderSize((prev) => ({
        ...prev,
        placeholderWidth: componentSize.compWidth - 90,
      }));
    } else console.log('아니야.');

    setPreviewSize((prevSize) => ({
      ...prevSize,
      previewWidth: updatedWidth,
      previewHeight: updatedHeight,
    }));

    console.log('무브');
  };

  const stopResize = () => {
    console.log('업');

    setIsResizing(false);
    setCardDisplay('block');
    setComponentSize((prevSize) => ({
      ...prevSize,
      compWidth: Math.round(previewSize.previewWidth / 89) * 89,
      compHeight: Math.round(previewSize.previewHeight / 89) * 89,
    }));
    console.log(componentSize.compWidth);
    console.log(componentSize.compHeight);
  };

  return (
    <>
      <CardBoard
        ref={cardBoardRef}
        className="Card"
        style={{
          top: topPx,
          left: leftPx,
          width: `${componentSize.compWidth}px`,
          height: `${componentSize.compHeight}px`,
          display: cardDisplay,
        }}
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
        <ResizeHandle ref={resizeHandleRef} onMouseDown={startResize} />
      </CardBoard>
      {isResizing && (
        <TestDiv
          ref={resizeCardRef}
          style={{
            top: topPx,
            left: leftPx,
            width: `${previewSize.previewWidth}px`,
            height: `${previewSize.previewHeight}px`,
          }}
          onMouseMove={resizeMouseMove}
          onMouseUp={stopResize}
        >
          <ResizeHandle />
        </TestDiv>
      )}
      {isResizing && (
        <ResizePlaceHolder
          ref={placeholderRef}
          style={{
            top: topPx,
            left: leftPx,
            width: `${placeholderSize.placeholderWidth}px`,
            height: `${placeholderSize.placeholderHeight}px`,
          }}
          onMouseMove={resizeMouseMove}
          onMouseUp={stopResize}
        />
      )}
    </>
  );
};

export default LineChart;
