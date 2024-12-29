import { getProduct } from "./products.js";

export const cart = JSON.parse(localStorage.getItem("cart")) || [{
  productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity: 2,
  deliveryOptionsId: '1'
},
{
  productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
  quantity: 1,
  deliveryOptionsId: '2'
}];

function saveToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
    
    const matchingItem = cart.find((item) => {
        return item.productId === productId;
    });
    
    let quantity = document.querySelector(".js-product-quantity-container-" + productId).value;
    quantity = parseInt(quantity);
 
    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      cart.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionsId: '1' 
      });
    }

    saveToLocalStorage();
}

export function removeFromCart(productId) {
    cart.forEach((item, index) => {
        if (item.productId === productId) {
            cart.splice(index, 1);
        }
    });

    saveToLocalStorage();
}

export function updateCartQuantity(){
    let cartQuantity = 0;

    cart.forEach((item) => {
        cartQuantity += item.quantity;
    });
    return cartQuantity;
}

export function updateQuantity(productId, newQuantity){
    cart.forEach((item) => {
        if (item.productId === productId) {
            item.quantity = newQuantity;
        }
    });

    saveToLocalStorage();
}

export function updateDeliveryOption(productId, newDeliveryOptionId){
    cart.forEach((item) => {
        if (item.productId === productId) {
            item.deliveryOptionsId = newDeliveryOptionId;
        }
    });

    saveToLocalStorage();
}