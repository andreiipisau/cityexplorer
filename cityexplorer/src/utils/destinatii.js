export const getOrase = (list) =>
  list.map(({ oras }) => oras)

export const getNevizitate = (list) =>
  list.filter(({ vizitat }) => !vizitat)

export const totalZile = (list) =>
  list.reduce((suma, { zile }) => suma + zile, 0)

export const formatDestinatie = ({ oras, tara, zile, vizitat }) =>
  `${vizitat ? '[x]' : '[ ]'} ${oras}, ${tara} (${zile} zile)`

export const numarPeTara = (list) =>
  list.reduce((contor, { tara }) => ({
    ...contor,
    [tara]: (contor[tara] || 0) + 1,
  }), {})

export const sortDupaZile = (list) =>
  [...list].sort((a, b) => b.zile - a.zile)

export const marcheazaVizitat = (list, id) =>
  list.map((d) =>
    d.id === id ? { ...d, vizitat: !d.vizitat } : d
  )

export const adaugaDestinatie = (list, d) =>
  [...list, d]

export const stergeDestinatie = (list, id) =>
  list.filter((d) => d.id !== id)