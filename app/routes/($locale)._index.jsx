import { defer, json } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import React, { useEffect, useRef, useState } from 'react';
import '../styles/home-video.css';
import { AnalyticsPageType } from '@shopify/hydrogen';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({ data }) => {
  return [{title: `Curry Wolf | ${data?.page.title ?? ''}`},
    {name :"description","content": data.page.seo.description }
  ];
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

  return defer({
    page,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
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

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      const initializeSlider = () => {
        const sliderWrapper = document.getElementById('slider-wrapper');
        const slides = document.querySelectorAll('.slide');
        const dotsContainer = document.getElementById('dots-container');
        const totalSlides = slides.length;
        let currentIndex = 1;
        let startX = 0;
        let endX = 0;

        if (dotsContainer.children.length === 0) {
          // Clear any existing clones
          sliderWrapper.innerHTML = '';
          slides.forEach((slide) => sliderWrapper.appendChild(slide));

          // Clone the first and last slides
          const firstSlideClone = slides[0].cloneNode(true);
          const lastSlideClone = slides[totalSlides - 1].cloneNode(true);

          sliderWrapper.appendChild(firstSlideClone);
          sliderWrapper.insertBefore(lastSlideClone, sliderWrapper.firstChild);
        }

        const allSlides = document.querySelectorAll('.slide');

        // Clear existing dots
        dotsContainer.innerHTML = '';

        for (let i = 0; i < Math.min(totalSlides, 3); i++) {
          const dot = document.createElement('span');
          dot.classList.add('dot');
          if (i === 0) {
            dot.classList.add('active');
          }
          dot.addEventListener('click', () => {
            currentIndex = i + 1;
            sliderWrapper.style.transition = 'transform 0.5s ease';
            updateSlider();
          });
          dotsContainer.appendChild(dot);
        }

        function updateDots() {
          const dots = dotsContainer.children;
          Array.from(dots).forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex - 1) {
              dot.classList.add('active');
            }
          });
        }

        function updateSlider() {
          const newTransform = -(currentIndex * 33.33) + 33.33;
          sliderWrapper.style.transform = `translateX(${newTransform}%)`;
          Array.from(allSlides).forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentIndex) {
              slide.classList.add('active');
            }
          });
          updateDots();
        }

        sliderWrapper.addEventListener('transitionend', () => {
          if (currentIndex >= totalSlides + 1) {
            sliderWrapper.style.transition = 'none';
            currentIndex = 1;
            updateSlider();
            setTimeout(() => {
              sliderWrapper.style.transition = 'transform 0.5s ease';
            }, 50);
          } else if (currentIndex <= 0) {
            sliderWrapper.style.transition = 'none';
            currentIndex = totalSlides;
            updateSlider();
            setTimeout(() => {
              sliderWrapper.style.transition = 'transform 0.5s ease';
            }, 50);
          }
        });

          // Touch events for swipe functionality
          sliderWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        sliderWrapper.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        sliderWrapper.addEventListener('touchend', () => {
            const diffX = startX - endX;
            if (diffX > 50) {
                // Swipe left (next slide)
                currentIndex++;
                sliderWrapper.style.transition = 'transform 0.5s ease';
                updateSlider();
            } else if (diffX < -50) {
                // Swipe right (previous slide)
                currentIndex--;
                sliderWrapper.style.transition = 'transform 0.5s ease';
                updateSlider();
            }
        });

        updateSlider();
      };

      setTimeout(initializeSlider, 2000);
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