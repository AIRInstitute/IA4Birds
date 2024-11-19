CREATE TABLE "species" (
  "id" int PRIMARY KEY,
  "comName" varchar,
  "sciName" varchar
);

CREATE TABLE "observation" (
  "id" int PRIMARY KEY,
  "locationId" varchar,
  "locationName" varchar,
  "lat" decimal,
  "lng" decimal,
  "date" datetime,
  "numObservation" int,
  "speciesId" int
);

CREATE TABLE "recording" (
  "id" int PRIMARY KEY,
  "location" varchar,
  "quality" varchar,
  "lat" decimal,
  "lng" decimal,
  "alt" int,
  "file" varchar,
  "fileName" varchar,
  "time" varchar,
  "date" datetime,
  "observationId" int
);

ALTER TABLE "observation" ADD FOREIGN KEY ("speciesId") REFERENCES "species" ("id");

ALTER TABLE "recording" ADD FOREIGN KEY ("observationId") REFERENCES "observation" ("id");
