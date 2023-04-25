import { useState } from 'react';
import styled from 'styled-components';
import CardMedia from '@mui/material/CardMedia';
import testImage from '../assets/images/test.png';

const Tile = styled.li`
  display: flex;
  font-size: 13px;
  margin: 0;
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background-color: #dcdcdc;
  }
`;

const Card = styled.div`
  display: flex;
  min-height: 50px;
  width: 100%;
  box-sizing: border-box;
`;

const media = {
  flex: '0 0 80px',
  height: '80px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #ccc',
};

const CardContent = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
`;

const CardTitle = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDescription = styled.span`
  margin-top: 8px;
  font-size: 12px;
  display: block;
  line-height: 16px;
  max-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
interface TileCardProps {
  type: string;
}
const TileCard = ({ type }: TileCardProps) => {
  const classes = `${type} Tile`;

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    return true;
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  return (
    <Tile draggable>
      <Card draggable className={classes} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}>
        <CardMedia style={media} image={testImage} title="Title" />
        <CardContent>
          <CardTitle>매트릭 차트</CardTitle>
          <CardDescription>
            Azure Monitor의 메트릭은 근 근 실시간 시나리오를 지원하는 경량 메트릭으로, 문제를 알리고 빠르게 감지하는 데
            특히 유용합니다. 줄바꿈줄바꿈
          </CardDescription>
        </CardContent>
      </Card>
    </Tile>
  );
};

export default TileCard;
