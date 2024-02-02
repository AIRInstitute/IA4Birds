#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
import psycopg2
from ai4birds_ingest_service import config
from ai4birds_ingest_service.log import logger

class PostgresSingleton:
    __instance = None

    def __init__(self):
        """
        Initializes the singleton instance with database connection parameters.
        """        
        self.host = config.DB_CONFIG['host']
        self.port = config.DB_CONFIG['port']
        self.user = config.DB_CONFIG['user']
        self.password = config.DB_CONFIG['password']
        self.database = config.DB_CONFIG['database']

    @staticmethod
    def getInstance() -> 'PostgresSingleton':
        """
        Gets or creates an instance of the singleton.

        Returns:
            :return: An instance of the PostgresSingleton.
            :rtype: PostgresSingleton
        """
        if PostgresSingleton.__instance == None:
            PostgresSingleton.__instance = PostgresSingleton()
        return PostgresSingleton.__instance

    def connect(self):
        """
        Establishes a connection to the PostgreSQL database.        
        """
        try:
            self.conn = psycopg2.connect(host=self.host, port=self.port, user=self.user, password=self.password, database=self.database)
            self.cur = self.conn.cursor()
            logger.info('Database connection established')
        except Exception as e:
            logger.error(f'Error database connection: {e}')


    def close(self):
        """
        Closes the database cursor and connection.
        """
        self.cur.close()
        self.conn.close()

    def execute(self, sql, params=None):
        """
        Executes a SQL statement with optional parameters.

        Args:
            :param sql: SQL statement to execute.
            :type sql: str, required
            :param params: Optional parameters for the SQL statement.
            :type params: tuple, optional
        """        
        try:
            self.cur.execute(sql, params)
            self.conn.commit()
        except Exception as e:
            logger.error(f'Error executing SQL statement: {e}')

    def fetchall(self):
        """
        Fetches all rows from the last executed query.

        Returns:
            :return: List of tuples containing fetched rows.
            :rtype: list
        """
        return self.cur.fetchall()

    def fetchone(self):
        """
        Fetches one row from the last executed query.

        Returns:
            :return: Tuple containing fetched row.
            :rtype: tuple
        """
        return self.cur.fetchone()
