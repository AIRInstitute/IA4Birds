CREATE TABLE IF NOT EXISTS species (
    id SERIAL PRIMARY KEY,
    comName VARCHAR(255) UNIQUE,
    sciName VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS observation (
    id SERIAL PRIMARY KEY,
    locationId VARCHAR(255),
    locationName VARCHAR(255),
    lat DECIMAL(9,6),  -- Asumiendo una precisión adecuada para coordenadas geográficas
    lng DECIMAL(9,6),
    date TIMESTAMP,  -- Usa TIMESTAMP para almacenar tanto fecha como hora
    numObservation INT,
    speciesId INT NULL,  -- Hacer opcional el speciesId
    CONSTRAINT fk_species
        FOREIGN KEY (speciesId) 
        REFERENCES species(id)
        ON DELETE SET NULL  
);

CREATE TABLE IF NOT EXISTS recording (
    id SERIAL PRIMARY KEY,
    recordingId VARCHAR(255) UNIQUE,  -- Asegurarse de que recordingId sea único si se usa en lógicas de inserción condicionales
    location VARCHAR(255),
    quality VARCHAR(255),
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    alt INT,
    file VARCHAR(255),
    fileName VARCHAR(255),
    time VARCHAR(255),  -- Si es un timestamp, considerar cambiar el tipo a TIME o TIMESTAMP
    date TIMESTAMP,
    observationId INT NULL,  -- Hacer opcional el observationId
    CONSTRAINT fk_observation
        FOREIGN KEY (observationId)
        REFERENCES observation(id)
        ON DELETE SET NULL  
);

CREATE TABLE IF NOT EXISTS user (
    id SERIAL PRIMARY KEY,                        
    name VARCHAR(255) NOT NULL,                     
    email VARCHAR(255) UNIQUE NOT NULL,             
    password VARCHAR(255) NOT NULL,                  
    organization VARCHAR(255),                      
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
    active BOOLEAN DEFAULT TRUE                      
);

CREATE TABLE IF NOT EXISTS device_status (
    id SERIAL PRIMARY KEY,
    gps_latitude DECIMAL(9,6) NOT NULL,
    gps_longitude DECIMAL(9,6) NOT NULL,
    status VARCHAR(255) NOT NULL,  -- Estado del dispositivo
    storage_status DECIMAL(5,2) NOT NULL,  -- Almacenamiento libre en GB, con dos decimales
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Última vez que se recibió la actualización
);
