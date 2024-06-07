import { Suspense, useState, useRef } from 'react';
import { defer, redirect } from '@shopify/remix-oxygen';
import { Await, Link, useLoaderData } from '@remix-run/react';
import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import { getVariantUrl } from '~/lib/variants';
import '../styles/product.css';
import dhlLogo from '../assets/dhl.png';
import certifiedBadge from '../assets/trustedlogo.png';
import earthLogo from '../assets/earth.png';
import securePay from '../assets/secure-pay.png';
import quickDelivery from '../assets/quick-delivery.png';
import faceSmile from '../assets/face-smile.png';
import decorativegarland from '../assets/decorativegarland.png';

export const meta = ({ data }) => {
  return [{ title: `Curry Wolf | ${data?.product.title ?? ''}` }];
};

export async function loader({ params, request, context }) {
  const { handle } = params;
  const { storefront } = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      !option.name.startsWith('fbclid')
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title'
    )
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({ product, request });
    }
  }

  const variants = storefront.query(VARIANTS_QUERY, {
    variables: { handle },
  });

  return defer({
    product,
    variants,
  });
}

function ProductMedia({ media }) {
  const videoRef = useRef(null);
  return (
    <div className="product-media">
      {media?.map((item) => {
        if (item.__typename === 'MediaImage') {
          return (
            <div className="product-image" data-aos="fade-up" data-aos-duration="2000" key={item.id}>
              <Image
                alt={item.image.altText || 'Product Image'}
                aspectRatio="1/1"
                data={item.image}
                key={item.image.id}
                sizes="(min-width: 45em) 50vw, 100vw"
              />
            </div>
          );
        } else if (item.__typename === 'Video') {
          const videoSource = item.sources.find(
            (source) => source.mimeType === 'video/mp4'
          );
          return (
            <div className="product-video" key={item.id}>
              <video ref={videoRef} muted loop>
                <source src={videoSource.url} type={videoSource.mimeType} />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function Product() {
  const { product, variants } = useLoaderData();
  const { selectedVariant } = product;

  const getMetafieldText = (metafield) => {
    if (!metafield) return '';

    try {
      const parsedValue = JSON.parse(metafield);
      return parsedValue.children
        ?.map((child) =>
          child.children?.map((grandChild) => grandChild.value).join(' ')
        )
        .join(' ');
    } catch (error) {
      return '';
    }
  };

  const preparationText = getMetafieldText(
    product.metafields?.find(
      (metafield) => metafield?.namespace === 'custom' && metafield?.key === 'preparation'
    )?.value
  );

  const additionalInformationText = getMetafieldText(
    product.metafields?.find(
      (metafield) =>
        metafield?.namespace === 'custom' && metafield?.key === 'additional_information'
    )?.value
  );

  const ingredientsText = getMetafieldText(
    product.metafields?.find(
      (metafield) =>
        metafield?.namespace === 'custom' && metafield?.key === 'ingredients'
    )?.value
  );

  const nutritionalValuesText = getMetafieldText(
    product.metafields?.find(
      (metafield) =>
        metafield?.namespace === 'custom' && metafield?.key === 'nutritional_values'
    )?.value
  );

  return (
    <div className='main-product-sec'>
      <div className="food-decorative-garland">
        <img src={decorativegarland} alt="food-decorative-garland" />
      </div>
      <div className="container">
        <div className="product-container">
          <div className="left-content">
            <div className="product-title">
              <h1 data-aos="fade-up" data-aos-duration="1500">{product.title}</h1>
            </div>
            <div className="left-bottom-content">
              <div className="info-wrap">
                {additionalInformationText && (
                  <div className="info-box">
                    <h2 data-aos="fade-up" data-aos-duration="1500">Additional Information</h2>
                    <p data-aos="fade-up" data-aos-duration="2000">{additionalInformationText}</p>
                  </div>
                )}
                {preparationText && (
                  <div className="info-box">
                    <h2 data-aos="fade-up" data-aos-duration="1500">Preparation</h2>
                    <p data-aos="fade-up" data-aos-duration="2000">{preparationText}</p>
                  </div>
                )}
              </div>
              <div className="smile-block">
                <div className="special-block">
                  <img src={faceSmile} alt='face smile icon' data-aos="fade-up" data-aos-duration="1500" />
                  <h4 data-aos="fade-up" data-aos-duration="2000">Special Selection</h4>
                  <p data-aos="fade-up" data-aos-duration="2500">Family manufacturer with its own recipe</p>
                </div>
                <div className="special-block">
                  <img src={quickDelivery} alt='quick delivery icon' data-aos="fade-up" data-aos-duration="1500" />
                  <h4 data-aos="fade-up" data-aos-duration="2000">Quick Delivery</h4>
                  <p data-aos="fade-up" data-aos-duration="2500">We deliver within 2-4 days*</p>
                </div>
                <div className="special-block">
                  <img src={securePay} alt='secure pay icon' data-aos="fade-up" data-aos-duration="1500" />
                  <h4 data-aos="fade-up" data-aos-duration="2000">Secure pay</h4>
                  <p data-aos="fade-up" data-aos-duration="2500">Pay securely via Paypal and Sofort.com</p>
                </div>
                <div className="special-block">
                  <img src={earthLogo} alt='earth icon' data-aos="fade-up" data-aos-duration="1500" />
                  <h4 data-aos="fade-up" data-aos-duration="2000">CO₂ more neutral Shipment</h4>
                  <p data-aos="fade-up" data-aos-duration="2500">Shipping takes place with DHL GoGreen</p>
                </div>
              </div>
            </div>
          </div>
          <div className="center-content">
            {product.media && <ProductMedia media={product.media.nodes} />}
          </div>
          <div className="right-content">
            <div className="product-content">
              <ProductPrice selectedVariant={selectedVariant} />
              <div data-aos="fade-up" data-aos-duration="2000" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              <Suspense
                fallback={
                  <ProductForm
                    product={product}
                    selectedVariant={selectedVariant}
                    variants={[]}
                  />
                }
              >
                <Await
                  errorElement="There was a problem loading product variants"
                  resolve={variants}
                >
                  {(data) => (
                    <ProductForm
                      product={product}
                      selectedVariant={selectedVariant}
                      variants={data.product?.variants.nodes || []}
                    />
                  )}
                </Await>
              </Suspense>

              {/* Display Metafield */}
              <div className="metafield">
                {nutritionalValuesText && (
                  <div className="ingridiant-box">
                    <h2 data-aos="fade-up" data-aos-duration="1500">Nutritional Values</h2>
                    <p data-aos="fade-up" data-aos-duration="2000">{nutritionalValuesText}</p>
                  </div>
                )}
                {ingredientsText && (
                  <div className="ingridiant-box">
                    <h2 data-aos="fade-up" data-aos-duration="1500">Ingredients</h2>
                    <p data-aos="fade-up" data-aos-duration="2000">{ingredientsText}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="right-bottom-content">
              <div className="cerified-box">
                <h4 data-aos="fade-up" data-aos-duration="1500">Certified online shop</h4>
                <img className="certified-logo" src={certifiedBadge} alt='certified logo' data-aos="fade-up" data-aos-duration="2000" />
              </div>
              <div className="certified-logo">
                <h4 data-aos="fade-up" data-aos-duration="1500">More quickly shipment</h4>
                <img className="dhl-logo" src={dhlLogo} alt='dhl logo' data-aos="fade-up" data-aos-duration="2000" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPrice({ selectedVariant }) {
  return (
    <div className="product-price" data-aos="fade-up" data-aos-duration="2500">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money className='p-price' data={selectedVariant?.price} />
      )}
    </div>
  );
}

function ProductForm({ product, selectedVariant, variants }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  return (
    <div className="product-form" data-aos="fade-up" data-aos-duration="2000">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({ option }) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <ProductQuantity quantity={quantity} onQuantityChange={handleQuantityChange} />
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({ option }) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({ value, isAvailable, isActive, to }) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function AddToCartButton({ analytics, children, disabled, lines, onClick }) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button className="yellow-btn"
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function ProductQuantity({ quantity, onQuantityChange }) {
  const handleQuantityChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value, 10) || 1);
    onQuantityChange(value);
  };

  const incrementQuantity = () => {
    onQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };

  return (
    <div className="product-quantity">
      <label htmlFor="quantity">Quantity:</label>
      <div className="quantity-controls">
        <button type="button" onClick={decrementQuantity}>-</button>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          step="1"
        />
        <button  type="button" onClick={incrementQuantity}>+</button>
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
      title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    metafields(identifiers: [{namespace: "custom", key: "nutritional_values"}, {namespace: "custom", key: "additional_information"}, {namespace: "custom", key: "ingredients"}, {namespace: "custom", key: "preparation"}]) {
      namespace
      key
      value
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
    media(first: 1) {
      nodes {
        __typename
        ... on MediaImage {
          id
          image {
            id
            url
            altText
            width
            height
          }
        }
        ... on Video {
          id
          sources {
            url
            mimeType
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;


/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantsQuery} ProductVariantsQuery */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineInput} CartLineInput */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
