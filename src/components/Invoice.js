import { firestore } from './firebase.js'
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const productContainer = document.getElementById('products-container');
const invoiceItems = document.getElementById('invoice-items');
const tableHeader = document.getElementById('table-header')
const subtotalElement = document.getElementById('subtotal');
const formElement = document.getElementById('code-form');
const invoiceTitleElement = document.getElementById('invoice-title');

let cart = {
    discount: false,
    promotionalCodes: ['abc', 'bca'],
    products: []
}

//------------------------- Renders ---------------------------------------------

export const renderApp = async() => {
    const querySnapshot = await getDocs(collection(firestore, "Products"));

    querySnapshot.forEach((doc) => {
        productContainer.innerHTML += `<div class="products_container-productCard">
            <img src="${doc.data().image}" alt="">
            <h3>${doc.data().name}</h3>
            <div class = "product-info">
                <p><span>id:</span> ${doc.id}</p>
                <p><span>Price:</span> $${doc.data().price}</p>
            </div>
            <button class="btn-add" data-id="${doc.id}">Add</button>
        </div>`
    });

    const addButton = productContainer.querySelectorAll(".btn-add");
    addButton.forEach((btn) => {
        btn.addEventListener("click", async(e) => {
            let id = e.target.dataset.id;
            try {
                if(cart.products.some((item) => item.id === id)){
                    cart.products.map((item => {
                        if(item.id === id){
                            item.quantity += 1;
                            updateValue(id, item.quantity);
                        }
                    }))
                } else {
                    const item = await getProduct(id);
                    cart.products.push({...item, quantity: 1, itemSubtotal: item.price});  
                }
                renderInvoice();
                updateInvoiceSubtotal();
                console.log(cart);
            } catch (error) {
                console.log(error)
            }
        })
    })
}

const renderInvoice = () => {
    invoiceItems.innerHTML = "";

    invoiceTitleElement.innerHTML = `<h1>Invoice Generated</h1>`

    tableHeader.innerHTML = `<tr>
        <th>PRODUCT</th>
        <th>QTY</th>
        <th>UNIT PRICE</th>
        <th>AMOUNT</th>
        <th>REMOVE</th>
    </tr>`

    cart.products.forEach((item) => {

        invoiceItems.innerHTML += `<tr>
            <td>${item.name}</td>
            <td><input 
                type="number" 
                min="1" 
                value="${item.quantity}"
                class="input-value" 
                data-id="${item.id}"
                />
            </td>
            <td>$${item.price}</td>
            <td>$${item.itemSubtotal}</td>
            <td><i class="fas fa-trash-alt btn-remove" data-id="${item.id}"></i></td>
        </tr>`
    })

    formElement.innerHTML = `
        <label>Add promotional code</label>
        <input type="text" id="promotional-code">
        <button id="btn-code">Enter</button>
    `

    const input = document.querySelectorAll(".input-value");
    input.forEach((i) => {
        i.addEventListener('input', updateCart);
        
    })

    const removeButton = document.querySelectorAll(".btn-remove");
    removeButton.forEach((i) => {
        i.addEventListener('click', removeProduct)
    })
}

//------------------- fecth product -------------------------

const getProduct = async(id) => {
    const docRef = doc(firestore, `Products/${id}`);
    const productDoc = await getDoc(docRef);
    if(productDoc.exists()){
        const product = productDoc.data();
        return {id, name: product.name, price: product.price};
    }
}

//------------------------Remove product --------------------------------

function removeProduct(e){
    let id = e.target.dataset.id;
    cart.products = cart.products.filter((item) => item.id !== id);
    updateInvoiceSubtotal();
    renderInvoice();
}


//---------------------- Updates ------------------------------

function updateCart(e) {
    let id = e.target.dataset.id;
    let value = e.target.value
    updateValue(id, value);
    updateInvoiceSubtotal();
    renderInvoice();
}

function updateValue(id, value) {
    cart.products = cart.products.map((item) => {
        if(item.id === id) {
            item.quantity = parseInt(value);
            item.itemSubtotal = item.price * item.quantity;
        }
        return item;
    })
    console.log(cart.products)
}

function updateInvoiceSubtotal() {
    let subTotalPrice = 0, 
        totalPrice = 0, 
        discount = 0,
        discountAmount = 0; 

    cart.products.forEach((item)=> {
        subTotalPrice += item.price * item.quantity
    })

    if(cart.discount){
        discount = subTotalPrice * 0.3;
        totalPrice = subTotalPrice - discount;
        discountAmount = 30;
    } else {
        totalPrice = subTotalPrice;
    }

    subtotalElement.innerHTML = `<tr>
            <td colspan="3" align="right">Sub Total</td>
            <td>$${subTotalPrice.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="3" align="right">Discount<span> (${discountAmount}%)</span></td>
            <td>$${discount.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="3" align="right">Total Amount<span> (USD)</span></td>
            <td>$${totalPrice.toFixed(2)}</td>
        </tr> `
}

//----------------- Promocional code form -------------------------------

formElement.addEventListener('submit', e => {
    e.preventDefault();

    const promotionalCode = formElement['promotional-code'].value;
    console.log(promotionalCode, cart.promotionalCodes)
    if(cart.promotionalCodes.some((code) => code === promotionalCode)){
        cart.discount = true;
        updateInvoiceSubtotal();
    } else {
        console.log('no existe');
    }  
    console.log(cart)
})


