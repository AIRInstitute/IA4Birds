DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kong') THEN
        CREATE DATABASE kong;
    END IF;
END $$;




