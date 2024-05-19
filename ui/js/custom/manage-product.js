document.addEventListener('DOMContentLoaded', async () => {
    const productModal = document.getElementById("productModal");

    // Fetch product data and populate the table
    const fetchProducts = async () => {
        try {
            const response = await fetch(productListApiUrl);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const products = await response.json();
            populateProductTable(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const populateProductTable = (products) => {
        let table = '';
        products.forEach(product => {
            table += `
                <tr data-id="${product.product_id}" data-name="${product.name}" data-unit="${product.uom_id}" data-price="${product.price_per_unit}">
                    <td>${product.name}</td>
                    <td>${product.uom_name}</td>
                    <td>${product.price_per_unit}</td>
                    <td><span class="btn btn-xs btn-danger delete-product">Delete</span></td>
                </tr>
            `;
        });
        document.querySelector("table tbody").innerHTML = table;
    };

    document.getElementById("saveProduct").addEventListener("click", async () => {
        const formData = new FormData(document.getElementById("productForm"));
        const requestPayload = {
            product_name: formData.get('name'),
            uom_id: formData.get('uoms'),
            price_per_unit: formData.get('price')
        };

        try {
            await callApi("POST", productSaveApiUrl, requestPayload);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    });

    document.addEventListener("click", async (event) => {
        if (event.target.classList.contains('delete-product')) {
            const tr = event.target.closest('tr');
            const productId = tr.dataset.id;
            const productName = tr.dataset.name;
            const isDelete = confirm(`Are you sure to delete ${productName} item?`);

            if (isDelete) {
                try {
                    await callApi("POST", productDeleteApiUrl, { product_id: productId });
                } catch (error) {
                    console.error('Error deleting product:', error);
                }
            }
        }
    });

    productModal.addEventListener('hide.bs.modal', () => {
        document.getElementById("id").value = '0';
        document.getElementById("name").value = '';
        document.getElementById("unit").value = '';
        document.getElementById("price").value = '';
        productModal.querySelector('.modal-title').textContent = 'Add New Product';
    });

    productModal.addEventListener('show.bs.modal', async () => {
        try {
            const response = await fetch(uomListApiUrl);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const uoms = await response.json();
            populateUOMOptions(uoms);
        } catch (error) {
            console.error('Error fetching UOMs:', error);
        }
    });

    const populateUOMOptions = (uoms) => {
        let options = '<option value="">--Select--</option>';
        uoms.forEach(uom => {
            options += `<option value="${uom.uom_id}">${uom.uom_name}</option>`;
        });
        document.getElementById("uoms").innerHTML = options;
    };

    await fetchProducts();
});

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
