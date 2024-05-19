let productPrices = {};

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch product data and populate the product dropdown
    const fetchProducts = async () => {
        try {
            const response = await fetch(productListApiUrl);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const products = await response.json();
            populateProductOptions(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Populate the product dropdown
    const populateProductOptions = (products) => {
        productPrices = {};
        let options = '<option value="">--Select--</option>';
        products.forEach(product => {
            options += `<option value="${product.product_id}">${product.name}</option>`;
            productPrices[product.product_id] = product.price_per_unit;
        });
        document.querySelectorAll(".product-box select").forEach(select => {
            select.innerHTML = options;
        });
    };

    // Add more product rows
    document.getElementById("addMoreButton").addEventListener("click", () => {
        const row = document.querySelector(".product-box").innerHTML;
        const container = document.querySelector(".product-box-extra");
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.innerHTML = row;
        newRow.querySelector('.remove-row').classList.remove('hideit');
        newRow.querySelector('.product-price').textContent = '0.0';
        newRow.querySelector('.product-qty').value = '1';
        newRow.querySelector('.product-total').textContent = '0.0';
        container.appendChild(newRow);
    });

    // Remove product row
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains('remove-row')) {
            event.target.closest('.row').remove();
            calculateValue();
        }
    });

    // Update product price on product selection change
    document.addEventListener("change", (event) => {
        if (event.target.classList.contains('cart-product')) {
            const productId = event.target.value;
            const price = productPrices[productId];
            const row = event.target.closest('.row');
            row.querySelector('#product_price').value = price;
            calculateValue();
        }
    });

    // Recalculate total on quantity change
    document.addEventListener("change", (event) => {
        if (event.target.classList.contains('product-qty')) {
            calculateValue();
        }
    });

    // Save order
    document.getElementById("saveOrder").addEventListener("click", async () => {
        const formData = new FormData(document.querySelector("form"));
        const requestPayload = {
            customer_name: formData.get('customerName'),
            grand_total: formData.get('product_grand_total'),
            order_details: []
        };

        const orderDetails = Array.from(document.querySelectorAll('.product-box-extra .row')).map(row => {
            return {
                product_id: row.querySelector('.cart-product').value,
                quantity: row.querySelector('.product-qty').value,
                total_price: row.querySelector('.product-total').textContent
            };
        });

        requestPayload.order_details = orderDetails;

        try {
            await callApi("POST", orderSaveApiUrl, requestPayload);
        } catch (error) {
            console.error('Error saving order:', error);
        }
    });

    // Fetch initial product data
    await fetchProducts();
});

const calculateValue = () => {
    let total = 0;
    document.querySelectorAll(".product-box-extra .row").forEach(row => {
        const qty = parseFloat(row.querySelector('.product-qty').value);
        const price = parseFloat(row.querySelector('#product_price').value);
        const itemTotal = price * qty;
        row.querySelector('.product-total').textContent = itemTotal.toFixed(2);
        total += itemTotal;
    });
    document.getElementById("product_grand_total").value = total.toFixed(2);
};

// Call API function
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
