import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
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
}

interface PostProps {
  post: Post;
}

export default function Post({}: PostProps) {
  // TODO
  return <div></div>;
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
  console.log(response);
  // const post: Post = {
  //   first_publication_date: '',
  //   data: {
  //     title: RichText.asText(response.data.title),
  //     banner: {
  //       url: 'string',
  //     },
  //     author: RichText.asText(response.data.author),
  //     content: [
  //       {
  //         heading: 'string',
  //         body: [
  //           {
  //             text: 'string',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // };

  return {
    props: {},
  };
};
