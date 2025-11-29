-- Drop all tables to allow fresh recreation with new schema
-- CAUTION: This will delete all existing data

USE portfolio;

DROP TABLE IF EXISTS technology;
DROP TABLE IF EXISTS calendarevent;
DROP TABLE IF EXISTS resume;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS about;
