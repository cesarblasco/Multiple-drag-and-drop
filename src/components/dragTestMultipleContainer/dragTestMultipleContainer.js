import { useState } from "react";

import DragAndDroppableItem from "src/components/dragAndDroppableItem/dragAndDroppableItem.js";
import DraggableItem from "src/components/draggableItem/draggableItem.js";
import MultiItemCustomDragLayer from "src/components/multiItemCustomDragLayer/multiItemCustomDragLayer.js";

import "../../app/globals.css";

import styles from "./dragTestMultipleContainer.module.css";

const dragTestMultipleContainer = () => {
  // when a SINGLE item (single draggable or drag and droppable element, non multi selection) is done we keep track of that particular item
  // separately from the  selectedItems collection to handle all single dragging cases separately
  const [unselectedDraggedItem, setUnselectedDraggedItem] = useState(null);

  // This state is used for MULTI item selection functionality and includes all type of items that need to be supported,
  const [selectedItems, setSelectedItems] = useState([]);

  // Keep track in this container / parent if an element is being dragged to handle toggling between single and multiple
  // item dragging
  const [isDragging, setIsDragging] = useState(false);

  // Keep track of which item(s) where "toggled" (selected / unselected) via their checkboxes
  const handleItemToggle = (selectedItem) => {
    let newItemsCollection = [...selectedItems];

    const indexOfElement = newItemsCollection.findIndex(
      (itemIteration) => itemIteration.itemId === selectedItem.itemId
    );

    if (indexOfElement !== -1) {
      newItemsCollection[indexOfElement].isItemSelected =
        selectedItem.isItemSelected;
    } else {
      newItemsCollection.push(selectedItem);
    }
    newItemsCollection = newItemsCollection.filter(
      (itemIteration) => itemIteration.isItemSelected
    );

    setUnselectedDraggedItem(null);
    setSelectedItems(newItemsCollection);
  };

  const handleItemDrag = (isDragging, unselectedItem) => {
    if (unselectedItem) {
      if (isDragging) {
        setUnselectedDraggedItem(unselectedItem);
      } else {
        setTimeout(() => {
          setUnselectedDraggedItem(null);
        }, 300);
      }
    }
    setIsDragging(isDragging);
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setUnselectedDraggedItem(null);
  };

  const handleItemsDrop = () => {
    clearSelection();
  };

  return (
    <div className={styles.wrapper}>
      <h1>Welcome to the multiple drag and drop test repo!</h1>
      <h2>
        Check any checkboxes and try dragging any element(s) inside a
        "DragAndDroppableItem" panel
      </h2>
      <div className={styles.settings}>
        <button onClick={clearSelection}>Clear selection</button>
      </div>

      <div className={styles.dragAndDropItems}>
        {[0, 1, 2, 3, 4, 5].map((id) => {
          return (
            <DragAndDroppableItem
              title={`DragAndDroppableItem test #${id}`}
              shouldDisplayCheckbox
              selectedItems={selectedItems}
              unselectedDraggedItem={unselectedDraggedItem}
              onItemsDrop={handleItemsDrop}
              onDragDropItemDragged={handleItemDrag}
              onToggle={handleItemToggle}
              isOtherItemDragging={isDragging}
              key={`dnd-${id}`}
              id={`dnd-${id}`}
            />
          );
        })}
      </div>
      <div className={styles.dragItems}>
        {[
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25,
        ].map((id) => {
          return (
            <DraggableItem
              title={`Draggable test #${id}`}
              onToggle={handleItemToggle}
              onItemDragged={handleItemDrag}
              selectedItems={selectedItems}
              isOtherItemDragging={isDragging}
              shouldDisplayCheckbox
              unselectedDraggedItem={unselectedDraggedItem}
              key={`l-${id}`}
              id={`l-${id}`}
            />
          );
        })}
        <MultiItemCustomDragLayer
          isOtherItemDragging={isDragging}
          unselectedDraggedItem={unselectedDraggedItem}
          selectedItems={selectedItems}
          title="test"
        />
      </div>
    </div>
  );
};

export default dragTestMultipleContainer;
