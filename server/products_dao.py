from sql_connection import get_sql_connection

def get_all_products(connection):
    cursor = connection.cursor()
    query = """
    SELECT products.product_id, products.name, products.uom_id, products.price_per_unit, uom.uom_name 
    FROM gs.products 
    INNER JOIN gs.uom ON products.uom_id = uom.uom_id
    """
    cursor.execute(query)
    response = []
    for row in cursor.fetchall():
        response.append({
            'product_id': row[0],
            'name': row[1],
            'uom_id': row[2],
            'price_per_unit': row[3],
            'uom_name': row[4]
        })
    cursor.close()
    return response

def insert_new_product(connection, product):
    cursor = connection.cursor()
    query = """
    INSERT INTO gs.products (name, uom_id, price_per_unit)
    VALUES (%s, %s, %s) RETURNING product_id
    """
    data = (product['product_name'], product['uom_id'], product['price_per_unit'])
    cursor.execute(query, data)
    product_id = cursor.fetchone()[0]
    connection.commit()
    cursor.close()
    return product_id

def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = "DELETE FROM gs.products WHERE product_id = %s RETURNING product_id"
    cursor.execute(query, (product_id,))
    deleted_id = cursor.fetchone()[0]
    connection.commit()
    cursor.close()
    return deleted_id

if __name__ == '__main__':
    connection = get_sql_connection()
    print("Products:", get_all_products(connection))
    new_product_id = insert_new_product(connection, {
        'product_name': 'potatoes',
        'uom_id': 1,
        'price_per_unit': 10
    })
    print("Inserted product ID:", new_product_id)
    # deleted_product_id = delete_product(connection, new_product_id)
    # print("Deleted product ID:", deleted_product_id)
    connection.close()
