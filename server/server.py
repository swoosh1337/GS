from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sql_connection import get_sql_connection
from fastapi.middleware.cors import CORSMiddleware


import products_dao
import orders_dao
import uom_dao

app = FastAPI()
connection = get_sql_connection()

origins = [
    "http://localhost",
    "http://localhost:63342",
    "http://localhost:5500",
    "http://127.0.0.1:63342",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(BaseModel):
    name: str
    uom_id: int
    price_per_unit: float

class Order(BaseModel):
    customer_name: str
    total_price: float
    datetime: str

class UOM(BaseModel):
    uom_name: str

@app.get("/getUOM")
async def get_uom():
    response = uom_dao.get_uoms(connection)
    return JSONResponse(content=response)

@app.get("/getProducts")
async def get_products():
    response = products_dao.get_all_products(connection)
    return JSONResponse(content=response)

@app.post("/insertProduct")
async def insert_product(product: Product):
    product_dict = product.dict()
    product_id = products_dao.insert_new_product(connection, product_dict)
    return JSONResponse(content={'product_id': product_id})

@app.get("/getAllOrders")
async def get_all_orders():
    response = orders_dao.get_all_orders(connection)
    return JSONResponse(content=response)

@app.post("/insertOrder")
async def insert_order(order: Order):
    order_dict = order.dict()
    order_id = orders_dao.insert_order(connection, order_dict)
    return JSONResponse(content={'order_id': order_id})

@app.post("/deleteProduct")
async def delete_product(request: Request):
    request_payload = await request.json()
    product_id = request_payload['product_id']
    return_id = products_dao.delete_product(connection, product_id)
    return JSONResponse(content={'product_id': return_id})

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI Server For Grocery Store Management System")
    uvicorn.run(app, host="0.0.0.0", port=8000)
