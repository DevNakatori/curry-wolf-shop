import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import '../styles/catering-page.css';
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
  const handle = params.handle || 'catering';
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  const faqHtml = extractFAQ(page.body); // Extract the FAQ section

  return json({page, faqHtml});

}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();

  return (
    <div className="page catering-main">
      <main dangerouslySetInnerHTML={{__html: page.body}} />
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

function extractFAQ(html) {
    const faqStart = html.indexOf('<div id="faq"');
    if (faqStart === -1) return '';
  
    const faqEnd = html.indexOf('</div>', faqStart);
    if (faqEnd === -1) return '';
  
    const faqHtml = html.slice(faqStart, faqEnd + 6);
    return faqHtml;
  }

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
