import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

type Post = {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
};

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <main>
      <header className={styles.header}>
        <img src={post.data.banner.url} />
        <div>
          <h1>{post.data.title}</h1>
          <div className={styles.postMeta}>
            <div>
              <FiCalendar />
              <time>{post.first_publication_date}</time>
            </div>
            <div>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
            <div>
              <FiClock />
              <span>4min</span>
            </div>
          </div>
        </div>
      </header>
      <article className={styles.post}>
        {post.data.content.map((content, key) => {
          return (
            <div key={key} className={styles.postContent}>
              <h2>{content.heading}</h2>
              {content.body.map((body, key) => {
                return <p key={key}>{body.text}</p>;
              })}
            </div>
          );
        })}
      </article>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  // TODO
  return {
    paths: [],
    fallback: 'blocking', // true, false, blocking
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('post', String(slug), {});
  const post: Post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content?.map(content => {
        return {
          heading: content.heading,
          body: content.body.map(body => {
            return {
              text: body.text,
            };
          }),
        };
      }),
    },
  };

  return {
    props: { post },
  };
};
