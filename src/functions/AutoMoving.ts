interface ComponentPosition {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  display: string;
}

interface PositionInterface {
  positionTop: number;
  positionLeft: number;
  positionWidth: number;
  positionHeight: number;
  zIndex: number;
}

export const AutoMoving = (
  elements: ComponentPosition[],
  placeholder: PositionInterface,
  autoMovingClickedElement: HTMLDivElement | null | undefined,
) => {
  const placeholderLeft = placeholder.positionLeft;
  const placeholderTop = placeholder.positionTop;
  const placeholderWidth = placeholder.positionWidth;
  const placeholderHeight = placeholder.positionHeight;

  const overlapResults = elements.map((element, index) => {
    const updatedElement = { ...element }; // 객체의 복사본 생성
    if (autoMovingClickedElement?.className.includes(element.id) || autoMovingClickedElement === null) {
      console.log(updatedElement);
      return updatedElement;
    }
    const horizontalOverlap =
      Math.max(updatedElement.left, placeholderLeft) <
      Math.min(updatedElement.left + updatedElement.width, placeholderLeft + placeholderWidth);
    const verticalOverlap =
      Math.max(updatedElement.top, placeholderTop) <
      Math.min(updatedElement.top + updatedElement.height, placeholderTop + placeholderHeight);

    if (horizontalOverlap && verticalOverlap) {
      const overlapTop = Math.max(updatedElement.top, placeholderTop);
      const overlapLeft = Math.max(updatedElement.left, placeholderLeft);
      const overlapBottom = Math.min(updatedElement.top + updatedElement.height, placeholderTop + placeholderHeight);
      const overlapRight = Math.min(updatedElement.left + updatedElement.width, placeholderLeft + placeholderWidth);

      const overlapHeight = Math.ceil((overlapBottom - overlapTop) / 10) * 10;
      const overlapWidth = Math.ceil((overlapRight - overlapLeft) / 10) * 10;

      const targetCenterX = updatedElement.left + updatedElement.width / 2;
      const targetCenterY = updatedElement.top + updatedElement.height / 2;
      const placeholderCenterX = placeholderLeft + placeholderWidth / 2;
      const placeholderCenterY = placeholderTop + placeholderHeight / 2;

      const horizontalDistance = targetCenterX - placeholderCenterX;
      const verticalDistance = targetCenterY - placeholderCenterY;

      if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
        if (horizontalDistance > 0) {
          // console.log('겹친 방향: 오른쪽', element);
          updatedElement.left += overlapWidth;

          return updatedElement;
        }

        if (updatedElement.left - overlapWidth < 0) {
          // console.log('겹친 방향: 왼쪽', element);
          updatedElement.left =
            Math.ceil((updatedElement.left + updatedElement.width + placeholderWidth - overlapWidth) / 90) * 90;
          return updatedElement;
        }
        updatedElement.left -= overlapWidth;
        return updatedElement;
      }

      if (verticalDistance > 0) {
        // console.log('겹친 방향: 아래');
        updatedElement.top += overlapHeight;
        return updatedElement;
      }

      if (updatedElement.top - overlapHeight < 0) {
        // console.log('겹친 방향: 위');
        updatedElement.top =
          Math.ceil((updatedElement.top + updatedElement.height + placeholderHeight - overlapHeight) / 90) * 90;
        return updatedElement;
      }
      updatedElement.top -= overlapHeight;
      return updatedElement;
    }
    return updatedElement;
  });

  /*
  const test: any[] = [];
  console.log(overlapResults);
  const antoMovingResults = overlapResults.map((currentElement, currentIndex, array) => {
    // overlapResults의 객체 수가 2개 이상 일때
    if (currentIndex > 0) {
      //
      const updatingCurrentElement = { ...currentElement };
      const previousElement = array[currentIndex - 1];
      const horizontalOverlap =
        Math.max(updatingCurrentElement.left, previousElement.left) <
        Math.min(
          updatingCurrentElement.left + updatingCurrentElement.width,
          previousElement.left + previousElement.width,
        );
      const verticalOverlap =
        Math.max(updatingCurrentElement.top, previousElement.top) <
        Math.min(
          updatingCurrentElement.top + updatingCurrentElement.height,
          previousElement.top + previousElement.height,
        );

      if (horizontalOverlap && verticalOverlap) {
        // console.log(currentElement);
        // console.log(previousElement);
        // console.log('겹쳤다리');
      }
    }

    return currentElement;
  });
*/

  return overlapResults;
};

export const ResizeAutoMoving = () => {
  return '앱';
};
