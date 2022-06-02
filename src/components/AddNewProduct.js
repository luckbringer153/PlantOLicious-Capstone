import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../custom-hooks";

export default function ProductForm() {
  const history = useHistory();
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    price: 0,
    description: "",
    category: "",
    inStockQuantity: 0,
    photoLinkHref:
      "" ||
      "https://i.pinimg.com/564x/34/b8/68/34b868caf02110382837647852f03c92.jpg",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      const response = await fetch(
        "https://plantolicious.herokuapp.com/api/products",
        {
          method: "POST",
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
      console.log("Error happened here!");
      console.error(err);
    }
  };

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
      <input className="buttons" type="submit" value="Add product" />
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
