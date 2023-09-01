import React from "react";
import styles from "./LanguageButton.module.css";

const LanguageButton = ({ iconSrc }) => {
  return (
    <button className={styles.languageButton}>
      <div className={styles.languageIcon}>{iconSrc}</div>
    </button>
  );
};

export default LanguageButton;
