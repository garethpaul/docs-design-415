import React from "react";
import styles from "./Sidebar.module.css";

const sections = [
  {
    title: "GET STARTED",
    links: [
      "Introduction",
      "Overview",
      "Key concepts",
      "Next steps",
      "Quickstart",
      "Libraries",
      "Models",
      "Deprecations",
      "Tutorials",
      "Policies",
    ],
  },
  {
    title: "GUIDES",
    links: [
      "GPT",
      "GPT best practices",
      "Image generation",
      "Fine-tuning",
      "Embeddings",
      "Speech to text",
      "Moderation",
      "Rate limits",
      "Error codes",
      "Safety best practices",
      "Production best practices",
    ],
  },
  {
    title: "CHAT PLUGINS",
    links: [
      "Introduction",
      "Getting started",
      "Authentication",
      "Examples",
      "Production",
      "Plugin review",
      "Plugin policies",
    ],
  },
];

const SidebarNav = () => {
  return (
    <div className={styles.docsNav}>
      <div className={styles.sideNav + " " + styles.sideNavPadded}>
        <div className={styles.searchContainer}>
          <button className={styles.DocSearchButton}>
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
                  fill-rule="evenodd"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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

        {sections.map((section) => (
          <section>
            <h3 className={styles.sideNavHeader}>{section.title}</h3>
            <ul className={styles.sideNav}>
              {section.links.map((link) => (
                <a
                  key={link}
                  href={`/docs/${link.toLowerCase().replace(/ /g, "-")}`}
                  className={styles.sideNavItem}
                >
                  {link}
                </a>
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
