// Define your API URLs
const productListApiUrl = 'http://127.0.0.1:8000/getProducts';
const uomListApiUrl = 'http://127.0.0.1:8000/getUOM';
const productSaveApiUrl = 'http://127.0.0.1:8000/insertProduct';
const productDeleteApiUrl = 'http://127.0.0.1:8000/deleteProduct';
const orderListApiUrl = 'http://127.0.0.1:8000/getAllOrders';
const orderSaveApiUrl = 'http://127.0.0.1:8000/insertOrder';

// For product drop in order
const productsApiUrl = 'https://fakestoreapi.com/products';

const callApi = async (method, url, data) => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        window.location.reload();
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
};

const calculateValue = () => {
    let total = 0;
    document.querySelectorAll(".product-item").forEach(item => {
        const qty = parseFloat(item.querySelector('.product-qty').value);
        const price = parseFloat(item.querySelector('#product_price').value);
        const itemTotal = price * qty;
        item.querySelector('#item_total').value = itemTotal.toFixed(2);
        total += itemTotal;
    });
    document.getElementById("product_grand_total").value = total.toFixed(2);
};

const orderParser = order => ({
    id: order.id,
    date: order.employee_name,
    orderNo: order.employee_name,
    customerName: order.employee_name,
    cost: parseInt(order.employee_salary)
});

const productParser = product => ({
    id: product.id,
    name: product.employee_name,
    unit: product.employee_name,
    price: product.employee_name
});

const productDropParser = product => ({
    id: product.id,
    name: product.title
});

// Enable bootstrap tooltip globally
// document.addEventListener('DOMContentLoaded', () => {
//     $('[data-toggle="tooltip"]').tooltip();
// });
