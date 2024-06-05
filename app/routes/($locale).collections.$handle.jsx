import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import earthLogo from '../assets/earth.png';
import securePay from '../assets/secure-pay.png';
import quickDelivery from '../assets/quick-delivery.png';
import faceSmile from '../assets/face-smile.png';
import '../styles/collection.css';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Curry Wolf | ${data?.collection.title ?? ''} Collection`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  const customMenuPromise = storefront.query(CUSTOM_MENU_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      customMenuHandle: 'collection-menu', // Adjust to your custom menu handle
    },
  });

  return json({
    collection,
    customMenu: await customMenuPromise,
  });
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection, customMenu} = useLoaderData();

  return (
    <div className="collection">
      <CustomMenu data={customMenu} />
      <div className='benifits'>
        <h4>Benefits of Curry Wolf</h4>
        <div>
          <img src={faceSmile} alt='face smile icon' />
          <h4>Special Selection</h4>
          <p>Family manufacturer with its own recipe</p>
        </div>
        <div>
          <img src={quickDelivery} alt='quick delivery icon' />
          <h4>Quick Delivery</h4>
          <p>We deliver within 2-4 days*</p>
        </div>
        <div>
          <img src={securePay} alt='secure pay icon' />
          <h4>Secure pay</h4>
          <p>Pay securely via Paypal and Sofort.com</p>
        </div>
        <div>
          <img src={earthLogo} alt='earth icon' />
          <h4>CO₂ more neutral Shipment</h4>
          <p>Shipping takes place with DHL GoGreen</p>
        </div>
      </div>
      <h1>{collection.title}</h1>
      {/* <p className="collection-description">{collection.description}</p> */}
      {collection.image && (
        <img src={collection.image.url}  className="collection image" alt={collection.image.altText || collection.title} />
      )}
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            <ProductsGrid products={nodes} />
            <br />
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </>
        )}
      </Pagination>
    </div>
  );
}

function CustomMenu({ data }) {
  return (
    <nav>
      <ul>
        {data.menu.items.map(item => (
          <li key={item.id}>
            <Link to={item.url}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * @param {{products: ProductItemFragment[]}}
 */
function ProductsGrid({products}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  const collectionBadge = product.metafield?.value;
  const titleParts = product.title.split('(');
  const titleMain = titleParts[0];
  const titleSub = titleParts[1] ? `(${titleParts[1]}` : '';
  const variantNumber = product.variants.nodes[0].id.match(/\d+/);
  const variantId = variantNumber ? variantNumber[0] : null;

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {collectionBadge && (
        <div className="collection-badge">
          <p>{collectionBadge}</p>
        </div>
      )}
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{titleMain}<br/>{titleSub}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
      <span>Add to cart</span>
    </Link>

    
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        title
        sku
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
    metafield(namespace: "custom", key: "collection_badge") {
      value
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language, country: $country) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        altText
        url
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
`;

const CUSTOM_MENU_QUERY = `#graphql
  query CustomMenu(
    $country: CountryCode
    $customMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $customMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@remix-run/react').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */