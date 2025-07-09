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

CREATE TABLE "segment_data" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "camera_id"  varchar,
  "segment_idx" int,
  "colatitude" float,
  "azimuth" float,
  "zoom_level" int,
  "average_area" float,
  "total_big_birds" int,
  "frames" jsonb,
  "received_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "heatmap_image" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "camera_id"  varchar,
  "heatmap_for" text,
  "image_url" text,
  "generated_at" timestamp NOT NULL DEFAULT now()
);

ALTER TABLE "observation" ADD FOREIGN KEY ("speciesId") REFERENCES "species" ("id");

ALTER TABLE "recording" ADD FOREIGN KEY ("observationId") REFERENCES "observation" ("id");
