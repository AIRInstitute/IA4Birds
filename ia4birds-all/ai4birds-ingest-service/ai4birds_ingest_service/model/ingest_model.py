#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

from datetime import datetime
from typing import NamedTuple


from ai4birds_ingest_service.database.db import PostgresSingleton
from ai4birds_ingest_service.log import logger

class DataModel(NamedTuple):
    key1: str
    key2: str

class Model:
    
    def __init__(self, id: int = -1, data: DataModel = None, created_at: datetime = None):
        self.id: int = id
        self.data: DataModel = data
        self.created_at: datetime = created_at

    def to_json(self):
        return {
            'id': self.id,
            'data': dict(self.data._asdict()),  
            'created_at': self.created_at
        }


    def get(self, id: int):
        tabla = 'tabla1'  
        param1 = 'id'

        db = PostgresSingleton.getInstance()
        
        try:
            db.connect()
            query = f"SELECT * FROM {tabla} WHERE {param1} = %s"
            values = (id,)

            db.execute(query, values)
            row = db.fetchone()
    
            if row:
                data_model = DataModel(*row[1:3])                
                objeto = Model(id=row[0], data=data_model, created_at=row[3])
                return objeto
            else:
                return None
        except:
            logger.error(f'Error select query: {e}')
            return None

        finally:
            db.close()

    def post(self, data: dict):

        tabla = 'tabla1'  
        param3 = 'created_at'

        db = PostgresSingleton.getInstance()
        created_at = datetime.now()

        try:
            db.connect()

            # Construir dinámicamente la consulta SQL de inserción
            columns = ', '.join(data.keys())
            values = ', '.join(['%s'] * (len(data)))

            query = f"INSERT INTO {tabla} ({columns}, {param3}) VALUES ({values}, %s) RETURNING *;"
            data_values = tuple(data.values()) + (datetime.now(),)
            db.execute(query, data_values)
            
            row = db.fetchone()
            if row:
                data_model = DataModel(*row[1:3])                
                objeto = Model(id=row[0], data=data_model, created_at=row[3])
                return objeto
            else:
                return None
        
        except:
            logger.error(f'Error insert query: {e}')
            return None
        
        finally:
            db.close()

    def delete(self, id: int):

        tabla = 'tabla1'
        param1 = 'id'
        
        db = PostgresSingleton.getInstance()

        try:
            db.connect()
            query = f"DELETE FROM {tabla} WHERE {param1} = %s RETURNING *"
            values = (id,)
            db.execute(query, values)
            
            row = db.fetchone()
            if row:
                data_model = DataModel(*row[1:3])                
                objeto = Model(id=row[0], data=data_model, created_at=row[3])
                return objeto
            else:
                return None
        except:
            logger.error(f'Error delete query: {e}')
            return None
        
        finally:
            db.close()
        
    def put(self, id: int, data: dict):
        print(id, data)
        tabla = 'tabla1'
        param1 = 'id'
        param2 = 'data'

        db = PostgresSingleton.getInstance()

        try:
            db.connect()    
            # Construir dinámicamente la parte de la consulta SET
            set_clause = ", ".join([f"{column} = %s" for column in data.keys()])
            query = f"UPDATE {tabla} SET {set_clause} WHERE {param1} = %s RETURNING *"

            data_values = tuple(data.values()) + (id, )
            db.execute(query, data_values)

            row = db.fetchone()
            if row:
                data_model = DataModel(*row[1:3])                
                objeto = Model(id=row[0], data=data_model, created_at=row[3])
                return objeto
            else:
                return None
        except:
            logger.error(f'Error update query: {e}')
            return None
        finally:
            db.close()

