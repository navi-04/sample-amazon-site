import {
    cart,
    removeFromCart,
    updateCartQuantity,
    updateQuantity,
    updateDeliveryOption
  } from "../../data/cart.js";
  import { products } from "../../data/products.js";
  import { formatCurrency } from "../utils/money.js";
  import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
  import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
  import { renderPaymentSummary } from "./paymentSummary.js";
  
  document.querySelector(".js-return-to-home-link").innerHTML =
    updateCartQuantity() + " items";
  
   export function renderCartSummary() {  
  
  let cartSummaryHTML = "";
  
  cart.forEach((cartItem) => {
    const matchingProduct = products.find((product) => {
      return product.id === cartItem.productId;
    });
  
   const deliveryOption = getDeliveryOption(cartItem);
  
    var today = new dayjs();
    const dateString = today
        .add(deliveryOption.deliveryDays, "days")
        .format("dddd, MMMM D");
  
    cartSummaryHTML += `
          <div class="cart-item-container js-cart-item-container-${
            matchingProduct.id
          }">
              <div class="delivery-date">
                Delivery date: ${dateString}  
              </div>
  
              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProduct.image}">
  
                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                  </div>
                  <div class="product-quantity">
                    <span>
                      Quantity: <span class="quantity-label js-qunatity-label-${
                        matchingProduct.id
                      }">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${
                      matchingProduct.id
                    }">
                      Update 
                    </span>
  
                    <input class="quantity-input js-quantity-input-${
                      matchingProduct.id
                    }">
  
                    <span class="link-primary save-quantity-link js-save-quantity-link" data-product-id="${
                      matchingProduct.id
                    }">Save</span>
  
                    <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${
                      matchingProduct.id
                    }">
                      Delete
                    </span>
                  </div>
                </div>
  
                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div> 
                  ${deliveryOptionsHTML(matchingProduct,cartItem)}
                </div>
              </div>
            </div>
            `;
  });
  
  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
  
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    var today = new dayjs();
    let html = "";
    deliveryOptions.forEach((option) => {
      const deliveryDate = today
        .add(option.deliveryDays, "days")
        .format("dddd, MMMM D");
        const priceString = option.priceCents === 0 
        ? "FREE" 
        :  `$${formatCurrency(option.priceCents)} -`;
  
        let isChecked = option.id === cartItem.deliveryOptionsId;
        html += `
                        <div class="delivery-option js-delivery-option"
                          data-product-id="${matchingProduct.id}"
                          data-delivery-option-id="${option.id}">
                        <input type="radio"
                          ${isChecked ? "checked" : ""}
                          class="delivery-option-input"
                          name="delivery-option-${matchingProduct.id}">
                        <div>
                          <div class="delivery-option-date">
                            ${deliveryDate}
                          </div>
                          <div class="delivery-option-price">
                            ${priceString} Shipping
                          </div>
                        </div>
                      </div>
            `;
    });
  
    return html;
  
  }
  
  document.querySelectorAll(".js-delete-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const cartItemContainer = document.querySelector(
        ".js-cart-item-container-" + productId
      );
      cartItemContainer.remove();
      document.querySelector(".js-return-to-home-link").innerHTML =
        updateCartQuantity() + " items";
        renderPaymentSummary();
    });
  });
  
  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      document
        .querySelector(".js-cart-item-container-" + productId)
        .classList.add("is-editing-quantity");
      document.querySelector(".js-qunatity-label-" + productId).innerHTML = "";
    });
  });
  
  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      let quantity = 0;
      quantity = document.querySelector(".js-quantity-input-" + productId).value;
      quantity = parseInt(quantity);
      updateQuantity(productId, quantity);
      document
        .querySelector(".js-cart-item-container-" + productId)
        .classList.remove("is-editing-quantity");
      document.querySelector(".js-return-to-home-link").innerHTML =
        updateCartQuantity() + " items";
      document.querySelector(".js-qunatity-label-" + productId).innerHTML =
        quantity;
      renderPaymentSummary();
    });
  });
  
  document.querySelectorAll(".js-delivery-option").forEach((option) => {
    option.addEventListener("click", () => {
      const { productId, deliveryOptionId } = option.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderCartSummary();
      renderPaymentSummary();
    });
  });
  
  }
  
  renderCartSummary();