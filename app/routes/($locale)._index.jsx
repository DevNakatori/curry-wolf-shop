
import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import React, { useEffect } from 'react';
import '../styles/home-video.css';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Curry Wolf | Home`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context}) {
  const handle = params.handle || 'index';

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return json({page});
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();

  useEffect(() => {
    const handleScroll = () => {
      // Add any specific scroll handling logic here
    };

    window.addEventListener('scroll', handleScroll);

    if (document.querySelectorAll('#videoOverlay').length) {
      window.addEventListener('scroll', function() {
        const videoOverlay = document.getElementById('videoOverlay');
        let scrollPosition = window.scrollY;
        let windowHeight = window.innerHeight;

        if (scrollPosition > 500) {
          videoOverlay.style.opacity = 1;
        } else {
          videoOverlay.style.opacity = 0;
        }
      });
    }

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="index-wrapper" dangerouslySetInnerHTML={{__html: page.body}} />
  );
}


const PAGE_QUERY = `#graphql
    query Page(
      $language: LanguageCode,
      $country: CountryCode,
      $handle: String!
    )
    @inContext(language: $language, country: $country) {
      page(handle: $handle) {
        id
        title
        body
        seo {
          description
          title
        }
      }
    }
  `;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */