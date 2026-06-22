import React from "react";
import styles from "./Sidebar.module.css";
import docsContent from "./docs-content.json";

const SidebarNav = () => {
  return (
    <div className={styles.docsNav}>
      <div className={styles.sideNav + " " + styles.sideNavPadded}>
        <div className={styles.searchContainer}>
          <button className={styles.DocSearchButton} type="button">
            <span className={styles.iconContainer}>
              <svg
                width="20"
                height="20"
                className={styles.DocSearchSearchIcon}
                viewBox="0 0 20 20"
              >
                <path
                  d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                  stroke="currentColor"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
            Search
            <span className={styles.shortcutKeys}>
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </span>
          </button>
        </div>

        {docsContent.sections.map((section) => (
          <section key={section.title}>
            <h3 className={styles.sideNavHeader}>{section.title}</h3>
            <ul className={styles.sideNav}>
              {section.links.map((topic) => (
                <li key={topic.href}>
                  <a
                    href={topic.href}
                    className={styles.sideNavItem}
                  >
                    {topic.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Repeat for other sections ... */}
      </div>
    </div>
  );
};

export default SidebarNav;
