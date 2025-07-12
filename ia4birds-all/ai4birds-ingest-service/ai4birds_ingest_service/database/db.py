#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
import psycopg2
from abc import ABC, abstractmethod
from ai4birds_ingest_service import config
from ai4birds_ingest_service.log import logger

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
        """
        Establishes a connection to the PostgreSQL database.
        Raises:
            Exception: If the connection to the database fails.
        """
        if self.conn is not None:
            return

        try:
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
            raise

    def close(self):
        """
        Closes the database cursor and connection if they exist.
        """
        if self.cur:
            self.cur.close()
            self.cur = None
        if self.conn:
            self.conn.close()
            self.conn = None
        logger.info('Database connection closed')

    def execute(self, sql, params=None):
        """
        Executes a SQL statement with optional parameters.

        Args:
            sql (str): The SQL statement to execute.
            params (tuple, optional): Parameters for the SQL statement.
        Raises:
            Exception: If the execution fails.
        """
        try:
            self.cur.execute(sql, params)
            self.conn.commit()
        except psycopg2.Error as e:
            logger.error(f'Error executing SQL statement: {e}')
            if self.conn:
                self.conn.rollback()
            raise

    def fetchall(self):
        """
        Fetches all rows from the last executed query.

        Returns:
            list: A list of tuples containing the fetched rows.
        """
        return self.cur.fetchall()

    def fetchone(self):
        """
        Fetches one row from the last executed query.

        Returns:
            tuple: A tuple containing the fetched row.
        """
        return self.cur.fetchone()
