from fastapi import FastAPI
from . import models, database
from .api import products, customers, orders

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Inventory & Order Management System")

# Include API routes
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Inventory & Order Management System API"}
