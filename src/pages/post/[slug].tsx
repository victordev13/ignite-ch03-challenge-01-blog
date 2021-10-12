import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

type Post = {
  first_publication_date: string | null;
  uid: string;
  data: {
    title: string;
    subtitle: string;
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
  const router = useRouter()

  const calculateReadTime = ({ data }: Post) => {
    const text = data.content.map(({ body, heading }) => [
      body.map(body => body.text).join(''), heading]
    ).join('');

    return Math.ceil(text.split(' ').length / 200)
  }

  return (
    <>
      {router.isFallback ? <div>Carregando...</div> : (
        <main>
          <header className={styles.header}>
            <img src={post.data.banner.url} />
            <div>
              <h1>{post.data.title}</h1>
              <div className={styles.postMeta}>
                <div>
                  <FiCalendar />
                  <time>{format(
                    new Date(post.first_publication_date),
                    'dd LLL yyyy',
                    {
                      locale: ptBR,
                    }
                  )}</time>
                </div>
                <div>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
                <div>
                  <FiClock />
                  <span>{`${calculateReadTime(post)} min`}</span>
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
        </main>)
      }
    </>);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    { fetch: ['uid'] }
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: 'blocking', // true, false, blocking
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('post', String(slug), {});
  const post: Post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content
    },
  };

  return {
    props: { post },
  };
};
