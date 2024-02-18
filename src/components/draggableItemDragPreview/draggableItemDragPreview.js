import styles from "./draggableItemDragPreview.module.css";

const DraggableItemDragPreview = ({ title }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.dragAndDropItemTitle}>{title}</p>
    </div>
  );
};

export default DraggableItemDragPreview;
