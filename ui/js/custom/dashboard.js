document.addEventListener('DOMContentLoaded', async () => {
    const fetchOrders = async () => {
        try {
            const response = await fetch(orderListApiUrl);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const orders = await response.json();
            populateOrderTable(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const populateOrderTable = (orders) => {
        let table = '';
        let totalCost = 0;

        orders.forEach(order => {
            totalCost += parseFloat(order.total);
            table += `
                <tr>
                    <td>${order.datetime}</td>
                    <td>${order.order_id}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.total.toFixed(2)} Rs</td>
                </tr>
            `;
        });

        table += `
            <tr>
                <td colspan="3" style="text-align: end"><b>Total</b></td>
                <td><b>${totalCost.toFixed(2)} Rs</b></td>
            </tr>
        `;

        document.querySelector("table tbody").innerHTML = table;
    };

    await fetchOrders();
});
