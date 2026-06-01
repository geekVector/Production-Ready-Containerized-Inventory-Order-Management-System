from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    
    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    full_name: str
    email: str
    phone: str

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    
    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemBase]

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    price: float
    
    class Config:
        from_attributes = True

class Order(OrderCreate):
    id: int
    created_at: datetime
    total_amount: float
    items: List[OrderItem]
    
    class Config:
        from_attributes = True
