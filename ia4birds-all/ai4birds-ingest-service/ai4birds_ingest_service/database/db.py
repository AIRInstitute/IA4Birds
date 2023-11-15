#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
import psycopg2
from ai4birds_ingest_service import config

class PostgresSingleton:
    __instance = None
    def __init__(self):
        self.host = config.DB_CONFIG['host']
        self.port = config.DB_CONFIG['port']
        self.user = config.DB_CONFIG['user']
        self.password = config.DB_CONFIG['password']
        self.database = config.DB_CONFIG['database']
    @staticmethod
    def getInstance() -> 'PostgresSingleton':
        if PostgresSingleton.__instance == None:
            PostgresSingleton.__instance = PostgresSingleton()
        return PostgresSingleton.__instance
    def connect(self):
        try:
            self.conn = psycopg2.connect(host=self.host, port=self.port, user=self.user, password=self.password, database=self.database)
            self.cur = self.conn.cursor()
            print('Connected to PostgreSQL database...')
        except Exception as e:
            print(e)
    def close(self):
        self.cur.close()
        self.conn.close()
    def execute(self, sql, params=None):
        try:
            self.cur.execute(sql, params)
            self.conn.commit()
        except Exception as e:
            print("Error executing SQL statement: " + str(e))
    def fetchall(self):
        return self.cur.fetchall()
    def fetchone(self):
        return self.cur.fetchone()