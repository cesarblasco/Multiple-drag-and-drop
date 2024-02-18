import { useEffect, useState, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import itemTypes from "@/helpers/enums/itemTypes";

import styles from "./dragAndDroppableItem.module.css";

const DragAndDroppableItem = ({
  id,
  selectedItems,
  unselectedDraggedItem,
  shouldDisplayCheckbox = false,
  onDragDropItemDragged,
  onItemsDrop,
  isOtherItemDragging,
  title,
  onToggle,
}) => {
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);
  const checkboxRef = useRef(null);

  const { DRAG_ITEM, DRAG_AND_DROP_ITEM } = itemTypes;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [DRAG_ITEM, DRAG_AND_DROP_ITEM],
      canDrop: () => true,
      drop: () => handleItemDrop(),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [selectedItems, unselectedDraggedItem]
  );

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: DRAG_AND_DROP_ITEM,
      item: { id, title },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  useEffect(function removeDefaultDraggingImage() {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  useEffect(
    function handleonDragDropItemDragged() {
      // handle case of dragging a single element WITHOUT selection
      if (!selectedItems.length) {
        onDragDropItemDragged(isDragging, {
          id,
          title,
          x: checkboxRef.current.offsetLeft,
          y: checkboxRef.current.offsetTop,
          itemType: DRAG_AND_DROP_ITEM,
        });
      } else {
        onDragDropItemDragged(isDragging);
      }
    },
    [isDragging]
  );

  const handleItemDrop = () => {
    console.log(
      { unselectedDraggedItem },
      { selectedItems },
      `item(s) dropped successfully on dragDropItem #${id}`
    );
    if (selectedItems.length) {
      setDroppedItems([...droppedItems, ...selectedItems]);
    } else {
      setDroppedItems([...droppedItems, unselectedDraggedItem]);
    }

    onItemsDrop();
  };

  useEffect(() => {
    if (!selectedItems.length) {
      setIsItemSelected(false);
    }
  }, [selectedItems]);

  const handleOnChange = (evt) => {
    setIsItemSelected(!isItemSelected);
    onToggle({
      itemId: id,
      title,
      isItemSelected: !isItemSelected,
      x: evt.target.offsetLeft,
      y: evt.target.offsetTop,
      itemType: DRAG_AND_DROP_ITEM,
    });
  };

  const backgroundColor = isOver ? "green" : "goldenrod";
  const styleIsDragging =
    unselectedDraggedItem?.id === id || (isOtherItemDragging && isItemSelected)
      ? styles.wrapperWithOpacity
      : styles.wrapperWithoutOpacity;
  const styleSelected = isItemSelected
    ? { outline: "3px solid black" }
    : { outline: "none" };

  return (
    <div
      ref={drop}
      style={{ backgroundColor }}
      className={`${styles.wrapper} ${styleIsDragging}`}
    >
      <div
        ref={drag}
        style={styleSelected}
        className={styles.dragDropItemWrapper}
      >
        {shouldDisplayCheckbox && (
          <input
            type="checkbox"
            ref={checkboxRef}
            checked={isItemSelected}
            onChange={handleOnChange}
          ></input>
        )}
        <p className={styles.dragDropItemTitle}>{title}</p>
        <div className={styles.dragDropItemContents}>
          {droppedItems.map((droppedItem) => {
            return <p>{droppedItem.title}</p>;
          })}
        </div>
      </div>
    </div>
  );
};

export default DragAndDroppableItem;
