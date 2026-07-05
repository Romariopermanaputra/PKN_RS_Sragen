require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadExistingImages() {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found.');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    if (fs.statSync(filePath).isFile()) {
      const fileBuffer = fs.readFileSync(filePath);
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(file, fileBuffer, {
          contentType: 'image/png', // This is just a fallback, should ideally guess by extension
          upsert: true
        });

      if (error) {
        console.error(`Failed to upload ${file}:`, error.message);
      } else {
        console.log(`Successfully uploaded ${file}`);
      }
    }
  }
}

uploadExistingImages().catch(console.error);
