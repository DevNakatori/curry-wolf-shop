import { json } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import React, { useEffect, useRef, useState } from 'react';
import '../styles/home-video.css';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({ data }) => {
  return [{ title: 'Curry Wolf | Home' }];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({ params, context }) {
  const handle = params.handle || 'index';

  const { page } = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ page });
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const { page } = useLoaderData();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoRef.current = videoElement;
      setIsPlaying(true);
    }

    return () => {
      if (videoElement) {
        setIsPlaying(false);
      }
    };
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    const indicatorDiv = document.getElementById('indicator');

    // Initially make the scroll indicator visible
    indicatorDiv.style.bottom = '0';
    indicatorDiv.style.opacity = '1';

    const handleScroll = () => {
      let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll === 0) {
        indicatorDiv.style.bottom = '0';
        indicatorDiv.style.opacity = '1';
      } else if (currentScroll > lastScrollTop) {
        indicatorDiv.style.bottom = '-100px';
        indicatorDiv.style.opacity = '0';
      }

      lastScrollTop = Math.max(0, currentScroll);
    };

    window.addEventListener('scroll', handleScroll);

    if (document.querySelectorAll('#videoOverlay').length) {
      window.addEventListener('scroll', function () {
        const videoOverlay = document.getElementById('videoOverlay');
        let scrollPosition = window.scrollY;
        let windowHeight = window.innerHeight;

        if (scrollPosition > 180) {
          videoOverlay.style.opacity = 1;
        } else {
          videoOverlay.style.opacity = 0;
        }
      });
    }
  }, []);

  return (
    <div className="index-wrapper" dangerouslySetInnerHTML={{ __html: page.body }} />
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
