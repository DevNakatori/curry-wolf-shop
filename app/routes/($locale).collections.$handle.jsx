import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useLocation} from '@remix-run/react';
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
import decorativegarland from '../assets/decorativegarland.png';
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
    pageBy: 12,
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
      <div className="food-decorative-garland">
        <img
          src={decorativegarland}
          className="decorative-image"
          alt={decorativegarland}
        />
      </div>
      <CustomMenu data={customMenu} />
      <div className='collection-banner'>
      <h1>{collection.title}</h1>
      {/* <p className="collection-description">{collection.description}</p> */}
      {collection.image && (
        <img src={collection.image.url}  className="collection image" alt={collection.image.altText || collection.title} data-aos="fade-up" data-aos-duration="1500" data-aos-once="true" />
      )}
      </div>
      <div className='benifits' data-aos="fade-up" data-aos-duration="1500" data-aos-once="true">
        <div className='container'>
          <div className='benifits-inner-wrap'>
            <h4>Vorteile von Curry Wolf</h4>
        <div className='banifits-wrap'>
        <div className='benifits-content'>
          <img src={faceSmile} alt='face smile icon' />
            <div className="">
              <h4>Special Selection</h4>
              <p>Family manufacturer with its own recipe</p>
            </div>
        </div>
        <div className='benifits-content'>
          <img src={quickDelivery} alt='quick delivery icon' />
        <div className="">
          <h4>Quick Delivery</h4>
          <p>We deliver within 2-4 days*</p>
        </div>
        </div>
        <div className='benifits-content'>
          <img src={securePay} alt='secure pay icon' />
          <div className="">
          <h4>Secure pay</h4>
          <p>Pay securely via Paypal and Sofort.com</p>
          </div>
        </div>
        <div className='benifits-content'>
          <img src={earthLogo} alt='earth icon' />
          <div className="">
          <h4>CO₂ more neutral Shipment</h4>
          <p>Shipping takes place with DHL GoGreen</p>
          </div>
        </div>
        </div>
        </div>
        </div>
      </div>
      <div className='container'>
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
          <div className='previous-button'>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span className='yellow-btn'>↑ Load previous</span>}
            </PreviousLink>
          </div>
            <ProductsGrid products={nodes} />
            <br />
            <div className='loadmore-button'>
            <NextLink>
              {isLoading ? 'Loading...' : <span className='yellow-btn'>Load more ↓</span>}
            </NextLink>
            </div>
          </>
        )}
      </Pagination>
      </div>
      <div className='collection-logo-sec'>
      <div className='container'>
        <div className='c-logo-wrap' data-aos="fade-up" data-aos-duration="1500" data-aos-once="true">
          <div className='left-l'>
            <h4>Worauf legen wir Wert?</h4>
            <p>Jeder Schritt bei der Herstellung unserer Currywurst im Glas ist Handarbeit. Vom Braten, Schneiden, Abfüllen bis zum Verschießen und Einwecken des Glases führen wir alle Arbeitsschritte sorgfältig durch. Und wir legen Wert auf die Herkunft unserer Zutaten. Das Produkt Original Berliner Currywurst ist vom Markenpatentamt geschützt. Wir sind selbst ein Berliner Familienunternehmen. Mit Leib und Seele unterstützen wir andere Berliner Familienbetriebe.</p>
          </div>
          <div className='right-l'>
            <div className='c-right-wrap'>
                <div className='right-inner'>
                    <div className='l-logo'>
                        <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/trusted_shop_seal_2_1.png?v=1718372000" />
                    </div>
                    <div className='r-content'>
                      <p>Zertifizierter online-shop</p>
                    </div>
                </div>
                <div className='right-inner'>
                    <div className='l-logo'>
                    <img src="https://cdn.shopify.com/s/files/1/0661/7595/9260/files/DHL-GoGreen-Logo_2_1.png?v=1718372000" />
                    </div>
                    <div className='r-content'>
                      <p>Zertifizierter online-shop</p>
                    </div>
                </div>
              </div>
              <p>* Lieferzeitangaben gelten für Lieferungen innerhalb Deutschlands, Lieferzeiten für andere Länder entnehmen Sie bitte den Zahlungs- und Versandinformationen</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function CustomMenu({ data }) {
  const location = useLocation();
  return (
    <nav data-aos="fade-up" data-aos-duration="1500" data-aos-once="true"> 
      <ul>
        {data.menu.items.map(item => (
          <li key={item.id}>
            <Link to={item.url} 
            className={item.url.includes(location.pathname) ? 'active' : ''} 
            >{item.title}</Link>
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
    <>
       <div className="products-grid">
      <div className='container'>
        <div className='product-g-wrap'>
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 12 ? 'eager' : undefined}
          />
        );

      })}
      </div>
      </div>
    </div>
  
    </>
 
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
      to={variantUrl} data-aos="fade-up" data-aos-duration="1500" data-aos-once="true"
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
      <h4>{titleMain}<br/></h4>
      <span>{titleSub}</span>
      <div className='c-price-range'>
        <Money data={product.priceRange.minVariantPrice} />
        </div>
        <div className='cart-btn'>
          <span className='yellow-btn'>Add to cart</span>
        </div>
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