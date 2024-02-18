import styles from "./dragAndDroppableItemDragPreview.module.css";

const DragAndDroppableItemDragPreview = ({ title }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.dragAndDropItemTitle}>{title}</p>
    </div>
  );
};

export default DragAndDroppableItemDragPreview;
