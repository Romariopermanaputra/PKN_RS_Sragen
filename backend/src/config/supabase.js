const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to upload file to Supabase Storage
const uploadFileToSupabase = async (file) => {
  if (!file) return null;
  const path = require('path');
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = unique + path.extname(file.originalname);

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error('Gagal mengupload gambar ke cloud storage.');
  }

  return filename;
};

// Helper function to delete file from Supabase
const deleteFileFromSupabase = async (filename) => {
  if (!filename) return;
  const { error } = await supabase.storage
    .from('uploads')
    .remove([filename]);
    
  if (error) console.error('Supabase delete error:', error);
};

module.exports = { supabase, uploadFileToSupabase, deleteFileFromSupabase };
