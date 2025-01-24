#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.

import psycopg2
from psycopg2.extras import execute_values
from ai4birds_ingest_service import config,logger

class PostgresSingleton:
    __instance = None
    def __init__(self):
        self.host = config.DB_CONFIG['host']
        self.port = config.DB_CONFIG['port']
        self.user = config.DB_CONFIG['user']
        self.password = config.DB_CONFIG['password']
        self.database = config.DB_CONFIG['database']


        # Inicialización de las variables conn y cur para evitar errores de acceso antes de conectar
        self.conn = None
        self.cur = None


    @staticmethod
    def getInstance() -> 'PostgresSingleton':
        if PostgresSingleton.__instance == None:
            PostgresSingleton.__instance = PostgresSingleton()
        return PostgresSingleton.__instance

    def connect(self):
        try:
            if self.conn is None or self.conn.closed:
                self.conn = psycopg2.connect(
                    host=self.host, 
                    port=self.port, 
                    user=self.user, 
                    password=self.password, 
                    database=self.database
                )
                self.cur = self.conn.cursor()
                logger.info('Database connection established')
            else:
                logger.info('Reusing existing database connection')
        except Exception as e:
            logger.error(f'Error database connection: {e}')
            self.conn = None
            self.cur = None  # Aseguramos que no se usen cursores nulos después

    def close(self):
        self.cur.close()
        self.conn.close()

    def execute(self, sql, params=None):
        try:
            self.cur.execute(sql, params)
            self.conn.commit()
        except Exception as e:
            #print("Error executing SQL statement: " + str(e))
            logger.error(f'Error executing SQL statement: ' + str(e))

    def executemany(self, sql, params=None):
        try:
            self.cur.executemany(sql, params)
            self.conn.commit()
        except Exception as e:
            #print("Error executingMany SQL statement: " + str(e))
            logger.error(f'Error executingMany SQL statement: ' + str(e))

    def execute_values(self, sql, data_list, page_size=100):
        if not self.conn or not self.cur:
            logger.error('Database connection is not established. Cannot execute query.')
            raise Exception("Database connection is not established.")
        
        try:
            execute_values(self.cur, sql, data_list, page_size=page_size)
            self.conn.commit()
        except Exception as e:
            logger.error(f'Error executing Values: {e}')
            if self.conn:
                self.conn.rollback()
            raise

    def fetchall(self):
        return self.cur.fetchall()

    def fetchone(self):
        return self.cur.fetchone()