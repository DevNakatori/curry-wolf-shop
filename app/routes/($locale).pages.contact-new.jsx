import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import Contact from '~/components/ContactForm';
import React, { useEffect } from "react";
import '../styles/contact-page.css';
import { loadScript } from '@shopify/hydrogen-react/load-script';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Curry Wolf | ${data?.page.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context}) {
//   if (!params.handle) {
//     throw new Error('Missing page handle');
//   }
  const handle = params.handle || 'contact-new';
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
  useEffect(() => {
    LoadBokunScript();
  }, []);

  function LoadBokunScript() {
      loadScript(`//static.klaviyo.com/onsite/js/klaviyo.js?Fcompany_id=WuBDFR`).catch(() => {
        console.log("klavidooo");
      });
}
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();

  return (
    <div className="page contact-page">
      <>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
      </>
    </div>
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
