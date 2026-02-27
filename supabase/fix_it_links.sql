-- Update the access_url and description in it_assets to point to Kestora
UPDATE it_assets
SET 
  access_url = REPLACE(REPLACE(access_url, 'syklicollege.edu', 'kestoracollege.com'), 'syklicollege', 'kestora'),
  description = REPLACE(REPLACE(description, 'syklicollege.edu', 'kestoracollege.com'), 'syklicollege', 'kestora')
WHERE 
  access_url LIKE '%syklicollege%' OR description LIKE '%syklicollege%';
