import React from 'react';
import BlogPostPaginator from '@theme-original/BlogPostPaginator';
import Twikoo from '@site/src/components/Twikoo';

export default function BlogPostPaginatorWrapper(props) {
  return (
    <>
      <BlogPostPaginator {...props} />
      <hr />
      <div>
        <Twikoo />
      </div>
    </>
  );
}
