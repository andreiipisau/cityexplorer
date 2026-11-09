import { useState, useEffect } from 'react';
import { getNevizitate, totalZile, adaugaDestinatie, stergeDestinatie } from './utils/destinatii.js';
import { getDestinatii, patchVizitat, postDestinatie } from './api/destinatii.js';

import PanouStatistici from './components/PanouStatistici.jsx';
import Rezumat from './components/Rezumat.jsx';
import FormularDestinatie from './components/FormularDestinatie.jsx';
import ListaDestinatii from './components/ListaDestinatii.jsx';
import Cautare from './components/Cautare.jsx';
import './App.css';

export default function App() {
  const [destinatii, setDestinatii] = useState([]);
  const [incarcare, setIncarcare] = useState(true);
  const [eroare, setEroare] = useState(null);
  const [seTrimite, setSeTrimite] = useState(false);
  const [textCautare, setTextCautare] = useState('');
  
  // Stările pentru paginare
  const [pagina, setPagina] = useState(1);
  const [totalPagini, setTotalPagini] = useState(1);

  useEffect(() => {
    async function incarca() {
      setIncarcare(true);
      try {
        const obiectRaspuns = await getDestinatii(pagina);
        setDestinatii(obiectRaspuns.data);
        setTotalPagini(obiectRaspuns.pages);
      } catch (err) {
        setEroare(err.message);
      } finally {
        setIncarcare(false);
      }
    }
    incarca();
  }, [pagina]);

  const total = destinatii.length;
  const nevizitate = getNevizitate(destinatii).length;
  const zile = totalZile(getNevizitate(destinatii));

  async function handleToggle(id) {
    const destinatie = destinatii.find((d) => d.id === id);
    if (!destinatie) return;

    try {
      const salvata = await patchVizitat(id, !destinatie.vizitat);
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdd(nouaDestinatie) {
    setSeTrimite(true);
    try {
      const salvata = await postDestinatie(nouaDestinatie);
      setDestinatii((curent) => adaugaDestinatie(curent, salvata));
    } catch (err) {
      console.error(err);
    } finally {
      setSeTrimite(false);
    }
  }

  function handleDelete(id) {
    setDestinatii((curent) => stergeDestinatie(curent, id));
  }

  const text = textCautare.trim().toLowerCase();
  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(text) ||
      d.tara.toLowerCase().includes(text)
  );

  return (
    <main>
      <h1>City Explorer</h1>
      
      <PanouStatistici />
      
      <Rezumat total={total} nevizitate={nevizitate} zile={zile} />
      <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
      <Cautare valoare={textCautare} onChange={setTextCautare} />

      {incarcare && <p className="stare">Se încarcă destinațiile...</p>}
      {eroare && <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>}

      {!incarcare && !eroare && destinatii.length === 0 && (
        <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
      )}

      {!incarcare && !eroare && destinatii.length > 0 && afisate.length === 0 && (
        <p className="gol">Niciun rezultat pentru „{textCautare}”.</p>
      )}

      {!incarcare && !eroare && destinatii.length > 0 && afisate.length > 0 && (
        <>
          <ListaDestinatii 
             destinatii={afisate} 
             onToggle={handleToggle} 
             onDelete={handleDelete}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <button 
              disabled={pagina === 1} 
              onClick={() => setPagina((p) => p - 1)}
            >
              Înapoi
            </button>
            <span>pagina {pagina} din {totalPagini}</span>
            <button 
              disabled={pagina === totalPagini} 
              onClick={() => setPagina((p) => p + 1)}
            >
              Înainte
            </button>
          </div>
        </>
      )}
    </main>
  );
}