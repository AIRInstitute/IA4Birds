#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.

import psycopg2
from psycopg2.extras import execute_values
from abc import ABC, abstractmethod
from ai4birds_ingest_service import config, logger

class Database(ABC):
    """Abstract base class defining the interface for database operations."""

    @abstractmethod
    def connect(self):
        """Establishes a connection to the database."""
        pass

    @abstractmethod
    def close(self):
        """Closes the database connection."""
        pass

    @abstractmethod
    def execute(self, sql, params=None):
        """Executes a SQL statement with optional parameters."""
        pass

    @abstractmethod
    def executemany(self, sql, params=None):
        """Executes a SQL statement for a sequence of parameters."""
        pass

    @abstractmethod
    def execute_values(self, sql, data_list, page_size=100):
        """Executes a SQL statement using `execute_values` for efficiency."""
        pass

    @abstractmethod
    def fetchall(self):
        """Fetches all rows from the last executed query."""
        pass

    @abstractmethod
    def fetchone(self):
        """Fetches one row from the last executed query."""
        pass


class PostgresDatabase(Database):
    """
    A concrete implementation of the Database interface for PostgreSQL.
    It manages the connection and cursor for database operations.
    """

    def __init__(self, db_config=None):
        """
        Initializes the database with connection parameters.

        Args:
            db_config (dict, optional): A dictionary with database configuration.
                                        If None, uses the global config.
        """
        conf = db_config or config.DB_CONFIG
        self.host = conf['host']
        self.port = conf['port']
        self.user = conf['user']
        self.password = conf['password']
        self.database = conf['database']
        self.conn = None
        self.cur = None

    def connect(self):
        """Establishes a connection to the PostgreSQL database."""
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
        except psycopg2.Error as e:
            logger.error(f'Error connecting to database: {e}')
            self.conn = None
            self.cur = None
            raise

    def close(self):
        """Closes the database cursor and connection if they exist."""
        if self.cur:
            self.cur.close()
            self.cur = None
        if self.conn:
            self.conn.close()
            self.conn = None
        logger.info('Database connection closed')

    def execute(self, sql, params=None):
        """Executes a SQL statement."""
        try:
            self.cur.execute(sql, params)
            self.conn.commit()
        except psycopg2.Error as e:
            logger.error(f'Error executing SQL statement: {e}')
            if self.conn:
                self.conn.rollback()
            raise

    def executemany(self, sql, params=None):
        """Executes a SQL statement for a sequence of parameters."""
        try:
            self.cur.executemany(sql, params)
            self.conn.commit()
        except psycopg2.Error as e:
            logger.error(f'Error in executemany SQL statement: {e}')
            if self.conn:
                self.conn.rollback()
            raise

    def execute_values(self, sql, data_list, page_size=100):
        """Executes a SQL statement using `execute_values`."""
        try:
            execute_values(self.cur, sql, data_list, page_size=page_size)
            self.conn.commit()
        except psycopg2.Error as e:
            logger.error(f'Error in execute_values: {e}')
            if self.conn:
                self.conn.rollback()
            raise

    def fetchall(self):
        """Fetches all rows from the last executed query."""
        return self.cur.fetchall()

    def fetchone(self):
        """Fetches one row from the last executed query."""
        return self.cur.fetchone()