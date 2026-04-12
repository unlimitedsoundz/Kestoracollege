-- Update the access_url and description in it_assets to point to Kestora
UPDATE it_assets
SET 
  access_url = REPLACE(REPLACE(access_url, 'kestora.edu', 'kestorauniversity.com'), 'kestora', 'kestora'),
  description = REPLACE(REPLACE(description, 'kestora.edu', 'kestorauniversity.com'), 'kestora', 'kestora')
WHERE 
  access_url LIKE '%kestora%' OR description LIKE '%kestora%';
