import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { Theme } from "@radix-ui/themes";
import Layout from "../../../components/Layout";
import SidebarNav from "../../../components/Sidebar";
import docsContent from "../../../components/docs-content.json";
import styles from "../../DocsPage.module.css";

type Topic = {
  title: string;
  slug: string;
  href: string;
  summary: string;
};

type TopicPageProps = {
  sectionTitle: string;
  topic: Topic;
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: docsContent.sections.flatMap((section) =>
    section.links.map((topic) => ({
      params: { section: section.slug, slug: topic.slug },
    })),
  ),
  fallback: false,
});

export const getStaticProps: GetStaticProps<TopicPageProps> = async ({ params }) => {
  const section = docsContent.sections.find((candidate) => candidate.slug === params?.section);
  const topic = section?.links.find((candidate) => candidate.slug === params?.slug);

  if (!section || !topic) return { notFound: true };

  return {
    props: {
      sectionTitle: section.title,
      topic,
    },
  };
};

const TopicPage = ({
  sectionTitle,
  topic,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Theme>
    <Layout title={`${topic.title} | OpenAI Docs`}>
      <div className={styles.docsShell}>
        <aside className={styles.sidebarColumn} aria-label="Documentation navigation">
          <SidebarNav />
        </aside>
        <main className={`${styles.mainContent} ${styles.topicContent}`}>
          <article className={styles.topicArticle}>
            <p className={styles.topicSection}>{sectionTitle}</p>
            <h1>{topic.title}</h1>
            <p className={styles.topicSummary}>{topic.summary}</p>
            <a className={styles.playgroundLink} href="/docs">
              Open the interactive playground
            </a>
          </article>
        </main>
      </div>
    </Layout>
  </Theme>
);

export default TopicPage;
