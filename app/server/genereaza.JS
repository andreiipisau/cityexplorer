import { pool } from './db.js';

const orase = ['Zalau', 'Oradea', 'Sibiu', 'Iasi', 'Timisoara', 'Constanta', 'Brasov', 'Cluj'];
const tari = ['Romania', 'Italia', 'Spania', 'Franta', 'Grecia', 'Japonia', 'Portugalia'];

console.log('Se genereaza 200.000 de randuri...');
const lot = 5000;
for (let i = 0; i < 200000; i += lot) {
  const valori = [];
  const semne = [];
  for (let j = 0; j < lot; j++) {
    const idx = i + j + 1;
    const oras = `${orase[idx % orase.length]}-${idx}`;
    const tara = tari[idx % tari.length];
    const zile = (idx % 14) + 1;
    valori.push(oras, tara, zile, false);
    semne.push('(?, ?, ?, ?)');
  }
  await pool.query(
    `INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES ${semne.join(',')}`,
    valori
  );
}
console.log('Gata! 200.000 de randuri adaugate.');
await pool.end();