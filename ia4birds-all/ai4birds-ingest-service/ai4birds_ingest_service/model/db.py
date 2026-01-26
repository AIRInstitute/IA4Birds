import psycopg2
import threading
from psycopg2.extras import execute_values
from ai4birds_ingest_service import config, logger

class PostgresSingleton:
    __instance = None

    def __init__(self):
        self.host = config.DB_CONFIG['host']
        self.port = config.DB_CONFIG['port']
        self.user = config.DB_CONFIG['user']
        self.password = config.DB_CONFIG['password']
        self.database = config.DB_CONFIG['database']

        # conexión/cursor por hilo
        self._local = threading.local()

    @staticmethod
    def getInstance() -> 'PostgresSingleton':
        if PostgresSingleton.__instance is None:
            PostgresSingleton.__instance = PostgresSingleton()
        return PostgresSingleton.__instance

    def _get_conn(self):
        return getattr(self._local, "conn", None)

    def _get_cur(self):
        return getattr(self._local, "cur", None)

    def connect(self):
        try:
            conn = self._get_conn()
            if conn is None or conn.closed:
                conn = psycopg2.connect(
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database
                )
                cur = conn.cursor()
                self._local.conn = conn
                self._local.cur = cur
                logger.info("Database connection established (thread-local)")
            else:
                # si el cursor se cerró por alguna razón, recrearlo
                cur = self._get_cur()
                if cur is None or cur.closed:
                    self._local.cur = conn.cursor()
                logger.info("Reusing existing database connection (thread-local)")
        except Exception as e:
            logger.error(f"Error database connection: {e}")
            self._local.conn = None
            self._local.cur = None

    @property
    def conn(self):
        return self._get_conn()

    @property
    def cur(self):
        return self._get_cur()

    def close(self):
        cur = self._get_cur()
        conn = self._get_conn()
        try:
            if cur and not cur.closed:
                cur.close()
        except Exception:
            pass
        try:
            if conn and not conn.closed:
                conn.close()
        except Exception:
            pass
        self._local.cur = None
        self._local.conn = None

    def execute(self, sql, params=None):
        self.connect()
        try:
            self.cur.execute(sql, params)
            self.conn.commit()
        except Exception as e:
            logger.error(f"Error executing SQL statement: {e}")
            if self.conn:
                self.conn.rollback()
            raise

    def executemany(self, sql, params=None):
        self.connect()
        try:
            self.cur.executemany(sql, params)
            self.conn.commit()
        except Exception as e:
            logger.error(f"Error executingMany SQL statement: {e}")
            if self.conn:
                self.conn.rollback()
            raise

    def execute_values(self, sql, data_list, page_size=100):
        self.connect()
        try:
            execute_values(self.cur, sql, data_list, page_size=page_size)
            self.conn.commit()
        except Exception as e:
            logger.error(f"Error executing Values: {e}")
            if self.conn:
                self.conn.rollback()
            raise

    def fetchall(self):
        return self.cur.fetchall()

    def fetchone(self):
        return self.cur.fetchone()
