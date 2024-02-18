import { useEffect, useState } from "react";
import { useDragLayer } from "react-dnd";

import itemTypes from "@/helpers/enums/itemTypes";

import DraggableItemDragPreview from "src/components/draggableItemDragPreview/draggableItemDragPreview.js";
import DragAndDroppableDragPreview from "src/components/dragAndDroppableItemDragPreview/dragAndDroppableItemDragPreview.js";

import styles from "./multiItemCustomDragLayer.module.css";

// reference:
// https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_js/02-drag-around/custom-drag-layer?from-embed=&file=/src/CustomDragLayer.js:1523-1533

const MultiItemCustomDragLayer = ({
  selectedItems,
  isOtherItemDragging,
  unselectedDraggedItem,
}) => {
  const [lastCursorCoordinates, setLastCursorCoordinates] = useState({});
  const [opacityItemValue, setOpacityItemValue] = useState(0);

  const { DRAG_ITEM, DRAG_AND_DROP_ITEM } = itemTypes;

  const { itemType, isDragging, item } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
  }));

  useEffect(function trackMouseCoordinates() {
    const trackMouseCoordinates = addEventListener("mousemove", (event) => {
      setLastCursorCoordinates({ x: event.pageX, y: event.pageY });
    });

    const trackMouseDraggingCoordinates = addEventListener(
      "dragover",
      (event) => {
        setLastCursorCoordinates({ x: event.pageX, y: event.pageY });
      }
    );

    const trackOnVerticalMouseLeaveTopOnDragging = document.addEventListener(
      "dragleave",
      (event) => {
        if (event.screenY === 0) {
          return;
        }

        if (event.clientY <= 100) {
          window.scroll({
            top: 0,
            behavior: "smooth",
          });
        }
      }
    );

    return () => {
      removeEventListener("mousemove", trackMouseCoordinates);
      removeEventListener("dragover", trackMouseDraggingCoordinates);
      removeEventListener("dragleave", trackOnVerticalMouseLeaveTopOnDragging);
    };
  }, []);

  useEffect(
    function setItemsOpacityValue() {
      if (isOtherItemDragging) {
        setOpacityItemValue(100);
      } else {
        setTimeout(() => {
          setOpacityItemValue(0);
        }, 300);
      }
    },
    [isOtherItemDragging]
  );

  const getItemsStyles = (index, draggedItemIndex) => {
    let stackPositionModifier = 0;

    if (selectedItems.length) {
      const isDraggedItemIndexIsTheLastIndex =
        draggedItemIndex === selectedItems.length - 1;
      let isLastIndex = index === selectedItems.length - 1;
      let isSemiLastIndex = index === selectedItems.length - 2;

      // For the stack effect to work correctly if the dragged item is the last item in the list we take the
      // previous 2 before it
      if (isDraggedItemIndexIsTheLastIndex) {
        isLastIndex = index === selectedItems.length - 2;
        isSemiLastIndex = index === selectedItems.length - 3;
      }

      if (isLastIndex) {
        stackPositionModifier = 4;
      } else if (isSemiLastIndex) {
        stackPositionModifier = 8;
      }
    }

    const transform = `translate(${
      lastCursorCoordinates.x + stackPositionModifier
    }px, ${lastCursorCoordinates.y + stackPositionModifier}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  };

  const renderItems = (itemIteration) => {
    if (!selectedItems.length) {
      switch (itemType) {
        case DRAG_ITEM:
          return <DraggableItemDragPreview title={item.title} />;
        case DRAG_AND_DROP_ITEM:
          return <DragAndDroppableDragPreview title={item.title} />;
        default:
          return null;
      }
    } else {
      return (
        <>
          {itemIteration.itemType === DRAG_ITEM && (
            <DraggableItemDragPreview title={itemIteration.title} />
          )}
          {itemIteration.itemType === DRAG_AND_DROP_ITEM && (
            <DragAndDroppableDragPreview title={itemIteration.title} />
          )}
        </>
      );
    }
  };

  const getItemsStylesDrop = () => {
    const transform = `translate(${lastCursorCoordinates.x}px, ${lastCursorCoordinates.y}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  };

  const renderItemsDrop = (itemIteration) => {
    if (!selectedItems.length) {
      switch (unselectedDraggedItem.itemType) {
        case DRAG_ITEM:
          return <DraggableItemDragPreview title={""} />;
        case DRAG_AND_DROP_ITEM:
          return <DragAndDroppableDragPreview title={""} />;
      }
    } else {
      return (
        <>
          {itemIteration.itemType === DRAG_ITEM && (
            <DraggableItemDragPreview title={""} />
          )}
          {itemIteration.itemType === DRAG_AND_DROP_ITEM && (
            <DragAndDroppableDragPreview title={""} />
          )}
        </>
      );
    }
  };

  const renderDraggedItems = () => {
    let layerStyles = {
      position: "absolute",
      pointerEvents: "none",
      width: "100%",
      height: "100%",
    };

    if (selectedItems.length) {
      return (
        <>
          {selectedItems.map((itemIteration, index) => {
            layerStyles = {
              ...layerStyles,
              left: itemIteration.x - lastCursorCoordinates.x,
              top: itemIteration.y - lastCursorCoordinates.y,
              zIndex: item.id === itemIteration.itemId ? 150 : 100,
            };

            const draggedItemIndex = selectedItems.findIndex(
              (selectedItem) => selectedItem.itemId === item.id
            );

            return (
              <div
                key={itemIteration.id}
                style={layerStyles}
                className={styles.positionOnDrag}
              >
                <div style={getItemsStyles(index, draggedItemIndex)}>
                  {renderItems(itemIteration)}
                </div>
              </div>
            );
          })}
        </>
      );
    } else {
      if (unselectedDraggedItem) {
        layerStyles = {
          ...layerStyles,
          left: unselectedDraggedItem.x - lastCursorCoordinates.x,
          top: unselectedDraggedItem.y - lastCursorCoordinates.y,
          zIndex: 100,
        };

        return (
          <div style={layerStyles} className={styles.positionOnDrag}>
            <div style={getItemsStyles()}>{renderItems()}</div>
          </div>
        );
      }
    }
  };

  const renderDroppedItems = () => {
    let layerStylesDrop = {
      position: "absolute",
      pointerEvents: "none",
      zIndex: 100,
      width: "100%",
      height: "100%",
      opacity: opacityItemValue,
    };

    if (selectedItems.length) {
      return (
        <>
          {selectedItems.map((item) => {
            layerStylesDrop = {
              ...layerStylesDrop,
              left: item.x - lastCursorCoordinates.x,
              top: item.y - lastCursorCoordinates.y,
            };

            return (
              <div style={layerStylesDrop} className={styles.positionOnDrop}>
                <div style={getItemsStylesDrop()}>{renderItemsDrop(item)}</div>
              </div>
            );
          })}
        </>
      );
    } else {
      if (unselectedDraggedItem) {
        layerStylesDrop = {
          ...layerStylesDrop,
          left: unselectedDraggedItem.x - lastCursorCoordinates.x,
          top: unselectedDraggedItem.y - lastCursorCoordinates.y,
        };

        return (
          <div style={layerStylesDrop} className={styles.positionOnDrop}>
            <div style={getItemsStylesDrop()}>{renderItemsDrop()}</div>
          </div>
        );
      }
    }
  };

  return (
    <>
      {isDragging && renderDraggedItems()}
      {!isDragging && renderDroppedItems()}
    </>
  );
};

export default MultiItemCustomDragLayer;
