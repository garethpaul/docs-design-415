import React, { ReactNode } from "react";
import styles from "./LanguageButton.module.css";

type LanguageButtonProps = {
  iconSrc: ReactNode;
  label: string;
};

const LanguageButton = ({ iconSrc, label }: LanguageButtonProps) => {
  return (
    <button className={styles.languageButton} type="button" aria-label={label} title={label}>
      <div className={styles.languageIcon}>{iconSrc}</div>
    </button>
  );
};

export default LanguageButton;
