import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../custom-hooks";

export default function EditProduct() {
  const history = useHistory();
  const { token } = useAuth();
  const { search } = useLocation();

  const searchObject = new URLSearchParams(search);
  const title = searchObject.get("title");
  const price = searchObject.get("price");
  const description = searchObject.get("description");
  const photoLinkHref = searchObject.get("photoLinkHref");
  const inStockQuantity = searchObject.get("inStockQuantity");
  const id = searchObject.get("id");

  const [form, setForm] = useState({
    title: title,
    price: price,
    description: description,
    photoLinkHref: photoLinkHref,
    inStockQuantity: inStockQuantity,
  });

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setForm({ ...form, [e.target.name]: e.target.checked });
      return;
    }

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://plantolicious.herokuapp.com/api/products/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      console.log({ data });

      history.push(`/products`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className="anpForm" onSubmit={handleSubmit}>
      <div>
        <label className="labels ">Plant Title: </label>
        <input
          className="input bigInput"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="labels ">Photo Link: </label>
        <input
          className="input bigInput"
          type="url"
          name="photoLinkHref"
          value={form.photoLinkHref}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <div className="small">
          <label className="labels ">Price: </label>
          <input
            className="input"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>
        <div className="small">
          <label className="labels ">Stock Quantity: </label>
          <input
            className="input"
            type="number"
            name="inStockQuantity"
            value={form.inStockQuantity}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="labels">Description: </label>
        <textarea
          className="textBox"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <input className="buttons" type="submit" value="Finish Edit" />
      <button
        className="buttons"
        name="clear"
        onClick={() => history.push(`/products`)}
      >
        Cancel
      </button>
    </form>
  );
}
