'use client';

import Image from 'next/image';
import '../../scss/components/biosimilars/BiosimilarsProducts.scss';

export default function BiosimilarsProducts({ data }) {
  const defaultData = {
    heading: "Some of our key approved biosimilar products include:",
    products: [
      {
        title: "Etanercept",
        description: "Our flagship biosimilar is used in treating chronic immune-related inflammatory diseases such as rheumatoid arthritis, psoriatic arthritis, axial spondyloarthritis, and plaque psoriasis.",
        icon: "/assets/images/biosimilars/icon2.svg"
      },
      {
        title: "Pegfilgrastim",
        description: "They are used in oncology supportive care to help manage chemotherapy-induced neutropenia.",
        icon: "/assets/images/biosimilars/icon2.svg"
      },
      {
        title: "Ranibizumab",
        description: "Our biosimilar developed for ophthalmic indications, reinforces Lupin's presence in complex therapies for retinal disorders.",
        icon: "/assets/images/biosimilars/icon2.svg"
      }
    ]
  };

  const productsData = data || defaultData;
  const products = productsData?.products || productsData?.items || defaultData.products;

  return (
    <section className="biosimilars-products" data-node-id="2875:210">
      <div className="biosimilars-products__container">
        <h2 className="biosimilars-products__heading">
          {productsData.heading || defaultData.heading}
        </h2>
        
        <div className="biosimilars-products__grid">
          {products.map((product, index) => {
            const isMiddle = index === 1; // Second box
            const isLast = index === products.length - 1;
            const hasIconOnTop = isMiddle; // Only second item has icon on top
            
            return (
              <div key={index} className={`biosimilars-products__box ${hasIconOnTop ? 'biosimilars-products__box--middle' : ''} ${isLast ? 'biosimilars-products__box--last' : ''}`}>
                {hasIconOnTop ? (
                  <>
                    <div className="biosimilars-products__icon">
                      <Image
                        src={product.icon || product.iconUrl || product.image || "/assets/images/biosimilars/icon2.svg"}
                        alt=""
                        width={114}
                        height={114}
                        quality={100}
                      />
                    </div>
                    <h3 className="biosimilars-products__title">
                      {product.title || product.name || product.heading || ''}
                    </h3>
                    <p className="biosimilars-products__description">
                      {product.description || product.text || product.content || ''}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="biosimilars-products__title">
                      {product.title || product.name || product.heading || ''}
                    </h3>
                    <p className="biosimilars-products__description">
                      {product.description || product.text || product.content || ''}
                    </p>
                    <div className="biosimilars-products__icon">
                      <Image
                        src={product.icon || product.iconUrl || product.image || "/assets/images/biosimilars/icon2.svg"}
                        alt=""
                        width={114}
                        height={114}
                        quality={100}
                      />
                    </div>
                  </>
                )}
                <div className="biosimilars-products__line">
                  <div className="biosimilars-products__line-pointer">
                    <Image
                      src="/assets/images/biosimilars/darkpinter.svg"
                      alt=""
                      width={25}
                      height={25}
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <h2 className="biosimilars-products__heading">
          {productsData.footerText || "This portfolio reflects our ability to address a plethora of therapeutic areas while meeting stringent quality and regulatory expectations."}
        </h2>
      </div>
    </section>
  );
}

