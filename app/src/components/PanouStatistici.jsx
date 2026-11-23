import { useState, useEffect } from 'react';
import { getStatistici } from '../api/statistici';

export default function PanouStatistici() {
  const [prag, setPrag] = useState(3);
  const [tara, setTara] = useState('');
  const [date, setDate] = useState(null);
  const [eroare, setEroare] = useState(null);

  useEffect(() => {
    let activ = true;
    setEroare(null);

    getStatistici(prag, tara)
      .then((rezultat) => {
        if (activ) setDate(rezultat);
      })
      .catch((err) => {
        if (activ) setEroare(err.message);
      });

    return () => {
      activ = false;
    };
  }, [prag, tara]);

  return (
    <section className="panou-statistici">
      <h2>Statistici</h2>
      <div className="controale-statistici">
        <label>
          Cel puțin{' '}
          <input
            type="number"
            min="1"
            value={prag}
            onChange={(e) => setPrag(Number(e.target.value) || 1)}
          />{' '}
          zile
        </label>
        <label>
          Țara{' '}
          <input
            type="text"
            placeholder="toate"
            value={tara}
            onChange={(e) => setTara(e.target.value)}
          />
        </label>
      </div>

      {eroare && <p className="eroare">Statistici indisponibile: {eroare}</p>}

      {date && !eroare && (
        <ul>
          <li>Destinații: {date.destinatii}</li>
          <li>Total zile: {date.zile}</li>
          <li>Media: {date.medie} zile</li>
        </ul>
      )}
    </section>
  );
}