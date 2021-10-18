import { firestore } from './firebase.js'
import { collection, getDocs } from "firebase/firestore";
import { getProduct } from "./api.js"


let cart = JSON.parse(localStorage.getItem('invoice')) ||
    {
    discount: false,
    promotionalCodes: ['1234', '5678'],
    products: []
    }; 

//---------------------HTML Elements -----------------------------------

const productContainer = document.getElementById('products-container');
const invoiceItems = document.getElementById('invoice-items');
const tableHeader = document.getElementById('table-header')
const subtotalElement = document.getElementById('subtotal');
const formElement = document.getElementById('code-form');
const invoiceTitleElement = document.getElementById('invoice-title');
const resetButton = document.getElementById('btn-reset');


//------------------------- Renders ---------------------------------------------

export const renderApp = async() => {
    updateInvoice();
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
                updateInvoice();
            } catch (error) {
                console.log(error)
            }
        })
    })
}

const renderInvoice = () => {
    invoiceItems.innerHTML = "";

    invoiceTitleElement.innerHTML = `<h1>Invoice</h1>`

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
        <button id="btn-code" class="btn btn-green">Enter</button>
    `

    const input = document.querySelectorAll(".input-value");
    input.forEach((i) => {
        i.addEventListener('input', updateCart);
        
    })

    const removeButton = document.querySelectorAll(".btn-remove");
    removeButton.forEach((i) => {
        i.addEventListener('click', removeProduct)
    })

    localStorage.setItem('invoice', JSON.stringify(cart));
}


const renderSubtotal = () => {
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


//------------------------Remove product --------------------------------

const removeProduct = (e) => {
    let id = e.target.dataset.id;
    cart.products = cart.products.filter((item) => item.id !== id);
    updateInvoice();
}


//---------------------- Updates ------------------------------

const updateInvoice = () => {
    renderSubtotal();
    renderInvoice();
}


const updateCart = (e) => {
    let id = e.target.dataset.id;
    let value = e.target.value
    updateValue(id, value);
    updateInvoice();

}

const updateValue = (id, value) => {
    cart.products = cart.products.map((item) => {
        if(item.id === id) {
            item.quantity = parseInt(value);
            item.itemSubtotal = item.price * item.quantity;
        }
        return item;
    })
}



//----------------- Promocional code form -------------------------------

formElement.addEventListener('submit', e => {
    e.preventDefault();

    const promotionalCode = formElement['promotional-code'].value;
    if(cart.promotionalCodes.some((code) => code === promotionalCode)){
        cart.discount = true;
        updateInvoice();
    } else {
        console.log('no existe');
    }  
    localStorage.setItem('invoice', JSON.stringify({...cart, discount: true}));
})

//-------------------------------Reset  --------------------------


resetButton.addEventListener('click', e => {
    localStorage.setItem('invoice', JSON.stringify({
        discount: false,
        promotionalCodes: ['1234', '5678'],
        products: []
        }));

        location.reload();
} )

