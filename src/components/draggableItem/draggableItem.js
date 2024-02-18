import { useEffect, useState, useRef } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import itemTypes from "@/helpers/enums/itemTypes";

import styles from "./draggableItem.module.css";

const draggableItem = ({
  id,
  title,
  onToggle,
  shouldDisplayCheckbox = false,
  onItemDragged,
  isOtherItemDragging,
  unselectedDraggedItem,
  selectedItems,
}) => {
  const [isItemSelected, setIsItemSelected] = useState(false);

  const checkboxRef = useRef(null);

  const { DRAG_ITEM } = itemTypes;

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: DRAG_ITEM,
      item: { id, title },
      canDrag: () => !selectedItems.length || isItemSelected,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag(),
      }),
    }),
    [isItemSelected, selectedItems]
  );

  useEffect(function removeDefaultDraggingImage() {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  useEffect(
    function handleonItemDragged() {
      // handle case of dragging a single element WITHOUT selection
      if (!selectedItems.length) {
        onItemDragged(isDragging, {
          id,
          title,
          x: checkboxRef.current.offsetLeft,
          y: checkboxRef.current.offsetTop,
          itemType: DRAG_ITEM,
        });
      } else {
        onItemDragged(isDragging);
      }
    },
    [isDragging]
  );

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
      itemType: DRAG_ITEM,
    });
  };

  const styleIsDragging =
    unselectedDraggedItem?.id === id || (isOtherItemDragging && isItemSelected)
      ? styles.wrapperWithOpacity
      : styles.wrapperWithoutOpacity;
  const styleSelected = isItemSelected
    ? { outline: "3px solid red" }
    : { outline: "none" };

  return (
    <div
      ref={drag}
      className={`${styles.wrapper} ${styleIsDragging}`}
      style={styleSelected}
    >
      {shouldDisplayCheckbox && (
        <input
          type="checkbox"
          ref={checkboxRef}
          checked={isItemSelected}
          onChange={handleOnChange}
        ></input>
      )}
      <p className={styles.itemTitle}>{title}</p>
    </div>
  );
};

export default draggableItem;
