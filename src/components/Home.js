import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    //create as async fetch function
    async function fetchProducts() {
      try {
        const response = await fetch(
          `https://plantolicious.herokuapp.com/api/products
        `,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        //unpacked the response stream
        const products = await response.json();

        setProducts(products);
      } catch (error) {
        //giving me a syntaxerror:unexpected token <in JSON at position 0
        console.log(error);
      }
    }

    // call it
    fetchProducts();
  }, []);

  return (
    <section className="homeBody">
      <aside className="homeBlurb">
        <h2 className="homeBlurbTitle">Welcome to Plant-O-Licous</h2>
        <h4 className="homeBlurbBody">
          Find your next best friend here! We've got great prices and an
          ever-changing selection. Our team works tirelessly to make sure you
          always get quality plants with absolutely NO articial dyes, root
          cages, or toxic pesticides. If you're ever dissatisfied with your
          purchase, we offer a 75% cash back guarentee, no questions asked. Only
          the best for our favorite "plant parents"!
        </h4>
        <div className="homePicContainer">
          <img
            src="https://purewows3.imgix.net/images/articles/2021_05/Best_Succulents_You_Can_Grow_Snake_Plant.jpg?auto=format,compress&cs=strip"
            alt="Snake Plant"
            className="snakePlantPic"
          />
          <div className="textBottomLeft">
            Snake Plant, <i>Dracaena trifasciata</i>
          </div>
        </div>
        <Link to="/products" className="linkHomeToAllProducts">
          Find your next plant buddy!
        </Link>
      </aside>

      <aside className="featuredProductsBlurb">
        <h3>Here are some of our featured products...</h3>
        {products &&
          products.map((product) => {
            const { id, title, price, photoLinkHref } = product;

            while (product.id < 4) {
              return (
                <Link
                  to={"/products/" + id}
                  key={id}
                  className="featuredPlants"
                >
                  <div className="eachPlantBlock">
                    <img
                      src={photoLinkHref}
                      alt="The plant"
                      className="plantPicForSale"
                    ></img>

                    <h3 className="eachPlantTitle">{title}</h3>
                    <p>${price}</p>

                    {/* if you're the admin, you should be able to edit/delete a product using a button on the "single product info" page, not here. */}
                  </div>
                </Link>
              );
            }
          })}
      </aside>
    </section>
  );
}
