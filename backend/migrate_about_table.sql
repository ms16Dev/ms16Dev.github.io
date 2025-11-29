-- Migration script to update the About table schema
-- Run this in your MySQL console or client

USE portfolio;

-- Add new columns to the about table
ALTER TABLE about 
ADD COLUMN name VARCHAR(255) DEFAULT 'My Name' AFTER id,
ADD COLUMN occupation VARCHAR(255) DEFAULT 'Full Stack Developer' AFTER name,
ADD COLUMN avatar_image LONGBLOB AFTER description,
ADD COLUMN social_links TEXT DEFAULT '[]' AFTER avatar_image;

-- Create the technology table
CREATE TABLE IF NOT EXISTS technology (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    image LONGBLOB NOT NULL,
    PRIMARY KEY (id)
);

-- Verify the changes
DESCRIBE about;
DESCRIBE technology;
