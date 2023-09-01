import React, { ReactNode } from "react";
import styles from "./SplitFlexComponent.module.css";

interface SplitFlexComponentProps {
  leftChild: ReactNode;
  rightChild: ReactNode;
}

const SplitComponent: React.FC<SplitFlexComponentProps> = ({
  leftChild,
  rightChild,
}) => {
  return (
    <div className={styles.flexContainer}>
      <div className={styles.flexItem}>{leftChild}</div>
      <div className={styles.flexItem}>{rightChild}</div>
    </div>
  );
};

export default SplitComponent;
