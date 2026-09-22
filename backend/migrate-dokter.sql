-- Migration to add education, experience, and training fields to dokter table
-- Run this SQL in Supabase SQL Editor

ALTER TABLE "dokter" 
  ADD COLUMN IF NOT EXISTS "pendidikan" TEXT,
  ADD COLUMN IF NOT EXISTS "pengalaman" TEXT,
  ADD COLUMN IF NOT EXISTS "pelatihan" TEXT;
