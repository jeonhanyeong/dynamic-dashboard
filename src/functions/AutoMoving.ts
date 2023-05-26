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
}

const isColliding = (loc: string, udt: ComponentPosition, overlap: number, els: ComponentPosition[]) => {
  let moved = 0;
  if (loc === 'right') {
    moved = udt.left + overlap;
    console.log('오른쪾 겹참');
  } else if (loc === 'left') {
    moved = udt.left - overlap;
    console.log('왼쪽 겹침');
  } else console.log('실패');

  const Colliding = els.some((component) => {
    const componentRight = component.left + component.width;
    const componentBottom = component.top + component.height;

    // 충돌 검사
    if (
      moved < componentRight &&
      udt.left >= component.left &&
      udt.top < componentBottom &&
      udt.top + udt.height > component.top
    ) {
      // 이동된 위치와 충돌하는 컴포넌트가 있다면 true 반환
      console.log('충돌있음');
      return true;
    }
    console.log('충돌없음');
    return false;
  });

  return Colliding;
};

export const AutoMoving = (
  elements: ComponentPosition[],
  placeholder: PositionInterface,
  autoMovingClickedElement: HTMLDivElement | null | undefined,
) => {
  const placeholderLeft = placeholder.positionLeft;
  const placeholderTop = placeholder.positionTop;
  const placeholderWidth = placeholder.positionWidth;
  const placeholderHeight = placeholder.positionHeight;

  const test = (update: ComponentPosition) => {
    const updateCopy = { ...update };
    const over = elements.some((element) => {
      const horizontalOverlap =
        Math.max(update.left, element.left) < Math.min(update.left + update.width, element.left + element.width);
      const verticalOverlap =
        Math.max(update.top, element.top) < Math.min(update.top + update.height, element.top + element.height);

      return horizontalOverlap && verticalOverlap;
    });

    if (over) {
      const objectWithMaxTopHeight = elements.reduce((maxObject, currentObject) => {
        const maxTopHeight = (maxObject.top || 0) + (maxObject.height || 0);
        const currentTopHeight = (currentObject.top || 0) + (currentObject.height || 0);
        return currentTopHeight > maxTopHeight ? currentObject : maxObject;
      }, {} as ComponentPosition);
      console.log(objectWithMaxTopHeight);
      updateCopy.top = Math.ceil((objectWithMaxTopHeight.top + objectWithMaxTopHeight.height) / 90) * 90;
      updateCopy.left = 0;
      return updateCopy;
    }

    return updateCopy;
  };

  const overlapResults = elements.map((element, index) => {
    const updatedElement = { ...element }; // 객체의 복사본 생성
    if (autoMovingClickedElement?.className.includes(element.id)) {
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
          if (updatedElement.left + overlapWidth > 900) {
            updatedElement.left =
              Math.ceil((updatedElement.left - updatedElement.width - placeholderWidth + overlapWidth) / 90) * 90;
            return updatedElement;
          }
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
        if (updatedElement.top + overlapHeight > 800) {
          // console.log('겹친 방향: 아래');
          updatedElement.top =
            Math.ceil((updatedElement.top - updatedElement.height - placeholderHeight + overlapHeight) / 90) * 90;
          return updatedElement;
        }
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

  const antoMovingResults = overlapResults.map((currentElement, currentIndex, array) => {
    if (currentIndex > 0) {
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

  return antoMovingResults;
};

export const ResizeAutoMoving = () => {
  return '앱';
};
