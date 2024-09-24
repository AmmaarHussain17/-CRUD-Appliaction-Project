import mysql.connector
from typing import List
import mysql.connector.pooling
from fastapi import FastAPI,HTTPException
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Fixing CORS issue
origins = ["http://127.0.0.1:5500"]
my_origins = ["*"]
my_methods = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = my_origins, # allows all origins
    allow_methods = my_methods, # alloes all api method calls
)

db_config = {
    'user':'root',
    'host':'localhost',
    'password':'open',
    'database':'afrahdb'
}

# pool efficiently manages and reuses database connections, and avoids the creation of new connection every req
db_connection_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name = "my_pool",**db_config)

def get_data_from_db():
    try:
        # cnx = mysql.connector.connect(**db_config)
        cnx = db_connection_pool.get_connection()

        sql_select_query = "SELECT * FROM Characters"
        cursor = cnx.cursor(dictionary=True) # I want the result of queries to be returned as dictionary and not tuples

        cursor.execute(sql_select_query)

        # get all records
        records = cursor.fetchall()

        # print("Total number of rows in table:",cursor.rowcount)

        # print("\nPrinting each row\n")

        # for row in records:
        #     print(row)

        return records
        
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        if cnx.is_connected():
            cnx.close()
            print("MySQl connection is closed")



# Endpoint to fetch all data from the database
@app.get("/items/",response_model=List[dict])
async def get_all_data():
    return get_data_from_db()
 
# Endpoint to delete a record from the database
@app.delete("/items/{record_id}")
async def delete_record(record_id:str):

    try:
        cnx = db_connection_pool.get_connection()
        cursor = cnx.cursor(dictionary=True)

        sql_delete_query = f"DELETE FROM Characters WHERE ID = {record_id}"
        cursor.execute(sql_delete_query)
        cnx.commit()

        return {"message":"Record deleted"}
    
    
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        if cnx.is_connected():
            cnx.close()
            print("MySQl connection is closed")


# Define a Pydantic model representing the structure of the data sent from JavaScript
class NewDataModel(BaseModel):
    Name: str
    Age: int
    Movie: str

# Endpoint to insert a record in the database
@app.post("/items/")
async def insert_record(new_data: NewDataModel):
        
    try:
        cnx = db_connection_pool.get_connection()
        cursor = cnx.cursor(dictionary=True)

        sql_update_query = f"INSERT INTO Characters(Name,Age,Movie) VALUES({new_data.Name},{new_data.Age},{new_data.Movie})"
        cursor.execute(sql_update_query)
        cnx.commit()

        return {"message":"Record Inserted"}
        
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        if cnx.is_connected():
            cnx.close()
            print("MySQl connection is closed")

# Endpoint to update a record in the database
@app.put("/items/{record_id}")
async def update_record(record_id:int,new_data:NewDataModel):
        
    try:
        cnx = db_connection_pool.get_connection()
        cursor = cnx.cursor(dictionary=True)

        sql_update_query = f"UPDATE Characters SET Name = '{new_data.Name}', Age = '{new_data.Age}', Movie = '{new_data.Movie}' WHERE ID = {record_id}"
        cursor.execute(sql_update_query)
        cnx.commit()

        return {"message":"Record Updated"}
    
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        if cnx.is_connected():
            cnx.close()
            print("MySQl connection is closed")
    

if __name__ == "__main__":

    uvicorn.run(app, host="localhost", port=8000)