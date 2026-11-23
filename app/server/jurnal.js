import { pool } from './db.js';

export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint();
  const cale = req.originalUrl;

  res.on('finish', async () => {
    const durata = Math.round(Number(process.hrtime.bigint() - inceput) / 1e6);
    try {
      await pool.query(
        'INSERT INTO jurnal (metoda, cale, status, durata_ms) VALUES (?, ?, ?, ?)',
        [req.method, cale, res.statusCode, durata]
      );
    } catch (err) {
      console.error('Eroare la scrierea în jurnal:', err.message);
    }
  });

  next();
}