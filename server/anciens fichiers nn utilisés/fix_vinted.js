const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.startsWith('vinted_') && f.endsWith('.json'));

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file));
  const enhanced = data.map(item => {
    const timestamp = item?.photo?.high_resolution?.timestamp;
    const published = timestamp ? new Date(timestamp * 1000).toISOString() : null;
    return {
      ...item,
      published // 👈 injecté à la racine de chaque objet
    };
  });

  fs.writeFileSync(file, JSON.stringify(enhanced, null, 2));
  console.log(`✅ Champ "published" ajouté : ${file}`);
});
