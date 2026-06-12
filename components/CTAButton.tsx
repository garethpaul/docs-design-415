import React from "react";
import styles from "./CTAButton.module.css";

const CTAButton = () => {
  return (
    <button className={styles.ctaButton} type="button">
      Make your first API call {">"}
      <span className={styles.blinkingCursor}>_</span>
    </button>
  );
};

export default CTAButton;
