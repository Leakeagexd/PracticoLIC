'use client';

import { useState } from 'react';

export default function Home() {

  const [pokemones, setPokemones] = useState([]);
  const [numero, setNumero] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [nivel, setNivel] = useState('');
  const [tipoImagen, setTipoImagen] = useState('url');
  const [imagenUrl, setImagenUrl] = useState('');
  const [error, setError] = useState('');
  const [cargandoApi, setCargandoApi] = useState(false);

  const manejarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cargarDesdePokeAPI = async () => {
    setCargandoApi(true);
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await res.json();

      const detalles = await Promise.all(
        data.results.map(async (p) => {
          const resDetalle = await fetch(p.url);
          return await resDetalle.json();
        })
      );

      const listaFormateada = detalles
        .map((p) => ({
          id: p.id,
          numero: String(p.id).padStart(3, '0'),
          nombre: p.name.charAt(0).toUpperCase() + p.name.slice(1),
          tipo: p.types[0].type.name.charAt(0).toUpperCase() + p.types[0].type.name.slice(1),
          nivel: Math.floor(Math.random() * 50) + 5,
          imagen: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
        }))
        .sort((a, b) => a.id - b.id); 

      setPokemones(listaFormateada);
      setCargandoApi(false);
    } catch (err) {
      console.error('Error al consumir PokeAPI:', err);
      setCargandoApi(false);
    }
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (!numero || !nombre || !tipo || !nivel || !imagenUrl) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (parseInt(nivel) <= 0) {
      setError('El nivel debe ser un número positivo mayor a 0.');
      return;
    }

    setError('');

    const nuevoPokemon = {
      id: Date.now(),
      numero: String(numero).padStart(3, '0'),
      nombre: nombre.trim(),
      tipo,
      nivel: parseInt(nivel),
      imagen: imagenUrl,
    };

    const nuevaLista = [...pokemones, nuevoPokemon].sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
    setPokemones(nuevaLista);

    setNumero('');
    setNombre('');
    setTipo('');
    setNivel('');
    setImagenUrl('');
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Encabezado Pokedex */}
      <nav className="navbar navbar-dark bg-danger shadow-sm mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h1 fw-bold d-flex align-items-center gap-2">
            <img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
              width="30" 
              height="30" 
            />
            POKEDEX
          </span>
          <button
            onClick={cargarDesdePokeAPI}
            className="btn btn-outline-light btn-sm fw-bold"
            disabled={cargandoApi}
          >
            {cargandoApi ? (
              <span>
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                Cargando...
              </span>
            ) : (
              <span>
                <i className="bi bi-cloud-download me-1"></i> Cargar Gen 1 (PokeAPI)
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="container">
        {/* Formulario de captura */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-header bg-danger text-white">
            <h4 className="mb-0 fs-5 fw-bold">
              <i className="bi bi-plus-circle me-2"></i>Registrar Pokemon
            </h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-warning py-2">{error}</div>}

            <form onSubmit={manejarSubmit}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label fw-bold">Numero de Pokedex *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ej: 025"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-bold">Nombre del Pokemon *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Pikachu"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-bold">Tipo Principal *</label>
                  <select
                    className="form-select"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Planta">Planta</option>
                    <option value="Fuego">Fuego</option>
                    <option value="Agua">Agua</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Bicho">Bicho</option>
                    <option value="Normal">Normal</option>
                    <option value="Veneno">Veneno</option>
                    <option value="Psíquico">Psíquico</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-bold">Nivel *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ej: 25"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label fw-bold">Imagen del Pokemon *</label>
                  <div className="mb-2">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipoImagen"
                        id="opcionUrl"
                        value="url"
                        checked={tipoImagen === 'url'}
                        onChange={() => { setTipoImagen('url'); setImagenUrl(''); }}
                      />
                      <label className="form-check-label" htmlFor="opcionUrl">URL de Internet</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipoImagen"
                        id="opcionArchivo"
                        value="archivo"
                        checked={tipoImagen === 'archivo'}
                        onChange={() => { setTipoImagen('archivo'); setImagenUrl(''); }}
                      />
                      <label className="form-check-label" htmlFor="opcionArchivo">Cargar desde el Equipo</label>
                    </div>
                  </div>

                  {tipoImagen === 'url' ? (
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://ejemplo.com/pokemon.png"
                      value={imagenUrl}
                      onChange={(e) => setImagenUrl(e.target.value)}
                    />
                  ) : (
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={manejarArchivo}
                    />
                  )}
                </div>

                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-danger px-4 fw-bold">
                    <i className="bi bi-plus-lg me-1"></i> Agregar Pokemon
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Total de registrados */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-secondary mb-0">Pokemon Registrados</h3>
          <span className="fs-5 badge bg-dark px-3 py-2">
            Total Registrados: {pokemones.length}
          </span>
        </div>

        {/* Mostrar mensaje si está vacía o mostrar lista con map() */}
        {pokemones.length === 0 ? (
          <div className="alert alert-info text-center py-4 shadow-sm border-0">
            <i className="bi bi-info-circle me-2 fs-5"></i>
            No hay ningún Pokemon registrado por el momento. Registra uno con el formulario o carga los 151 de la 1.ª Generacion con el boton superior.
          </div>
        ) : (
          <div className="row g-3">
            {pokemones.map((pokemon) => (
              <div key={pokemon.id} className="col-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm border-1 text-center">
                  <div className="p-3 bg-light rounded-top">
                    <img
                      src={pokemon.imagen}
                      alt={pokemon.nombre}
                      className="img-fluid"
                      style={{ height: '120px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                      }}
                    />
                  </div>
                  <div className="card-body p-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">N.º {pokemon.numero}</span>
                      <span className="badge bg-warning text-dark">Niv. {pokemon.nivel}</span>
                    </div>
                    <h5 className="card-title fw-bold fs-6 mb-2">{pokemon.nombre}</h5>
                    <span className="badge bg-primary">{pokemon.tipo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}