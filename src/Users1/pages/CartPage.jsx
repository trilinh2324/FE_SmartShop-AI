import React from "react";
import Header from "../components/home/Header";
import HomeCarts from "../components/carts/HomeCarts";
import Footer from "../components/home/Footer";

export default function CartPage() {
  return (
    <div className="cart-page">
      <Header />
      <main className="cart-main">
        <HomeCarts />
      </main>
      <Footer />
    </div>
  );
}
