from sql_connection import get_sql_connection
def get_uoms(connection):
    cursor = connection.cursor()
    query = ("select * from uom")
    cursor.execute(query)
    response = []
    for (uom_id, uom_name) in cursor:
        response.append({
            'uom_id': uom_id,
            'uom_name': uom_name
        })
    cursor.close()
    return response


if __name__ == '__main__':

    connection = get_sql_connection()
    print(get_uoms(connection))
    # print(get_all_products(connection))
