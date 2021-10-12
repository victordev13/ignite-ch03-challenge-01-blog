import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page?: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <div className={styles.container}>
      <div>
        {postsPagination.results.map(post => (
          <article className={styles.post} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <h2>{post.data.title}</h2>
              </a>
            </Link>
            <p>{post.data.subtitle}</p>
            <div className={styles.postMeta}>
              <div>
                <FiCalendar />
                <span>{format(
                  new Date(post.first_publication_date),
                  'dd LLL yyyy',
                  {
                    locale: ptBR,
                  }
                )}</span>
              </div>
              <div>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {postsPagination.next_page !== null && (
        <p className={styles.loadMore} onClick={() => null}>
          Carregar mais posts
        </p>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    { pageSize: 5 }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: { postsPagination },
  };
};
