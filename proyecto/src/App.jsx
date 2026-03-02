import React, { useState, useEffect } from 'react';

function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [team, setTeam] = useState([]);
  const [savedTeams, setSavedTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar lista de Pokémon desde la API
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        setAllPokemon(data.results);
        setFilteredPokemon(data.results);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  // Cargar equipos guardados desde localStorage al inicio
  useEffect(() => {
    const stored = localStorage.getItem('savedTeams');
    if (stored) {
      setSavedTeams(JSON.parse(stored));
    }
  }, []);

  // Guardar equipos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('savedTeams', JSON.stringify(savedTeams));
  }, [savedTeams]);

  // Filtrar Pokémon según el término de búsqueda
  useEffect(() => {
    const filtered = allPokemon.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, allPokemon]);

  const addToTeam = (pokemon) => {
    if (team.length >= 6) {
      alert('El equipo no puede tener más de 6 Pokémon.');
      return;
    }
    if (team.some(p => p.name === pokemon.name)) {
      alert('Ese Pokémon ya está en el equipo.');
      return;
    }
    // Extraer ID de la URL para construir la imagen
    const id = pokemon.url.split('/')[6];
    const pokemonWithImage = {
      ...pokemon,
      id,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    };
    setTeam([...team, pokemonWithImage]);
  };

  const removeFromTeam = (pokemonName) => {
    setTeam(team.filter(p => p.name !== pokemonName));
  };

  const saveTeam = () => {
    if (team.length === 0) {
      alert('Agrega al menos un Pokémon al equipo.');
      return;
    }
    if (!teamName.trim()) {
      alert('Ingresa un nombre para el equipo.');
      return;
    }
    const newTeam = {
      id: Date.now(),
      name: teamName,
      members: team
    };
    setSavedTeams([...savedTeams, newTeam]);
    setTeamName('');
    alert('Equipo guardado correctamente.');
  };

  const loadTeam = (teamToLoad) => {
    setTeam(teamToLoad.members);
  };

  const deleteSavedTeam = (id) => {
    setSavedTeams(savedTeams.filter(t => t.id !== id));
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      color: '#333'
    },
    main: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginTop: '20px'
    },
    panel: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: '#f9f9f9'
    },
    searchInput: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    pokemonList: {
      maxHeight: '400px',
      overflowY: 'auto',
      border: '1px solid #eee',
      borderRadius: '4px',
      padding: '5px'
    },
    pokemonItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px',
      borderBottom: '1px solid #eee',
      cursor: 'pointer'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '10px',
      marginBottom: '15px'
    },
    teamCard: {
      border: '1px solid #ddd',
      borderRadius: '6px',
      padding: '8px',
      textAlign: 'center',
      backgroundColor: 'white'
    },
    sprite: {
      width: '80px',
      height: '80px',
      objectFit: 'contain'
    },
    removeBtn: {
      backgroundColor: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      cursor: 'pointer',
      marginTop: '5px'
    },
    addBtn: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      cursor: 'pointer'
    },
    saveSection: {
      marginTop: '15px',
      padding: '10px',
      backgroundColor: '#e9f7fe',
      borderRadius: '6px'
    },
    teamNameInput: {
      padding: '6px',
      marginRight: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    saveBtn: {
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '6px 12px',
      cursor: 'pointer'
    },
    savedTeamsList: {
      marginTop: '20px',
      borderTop: '2px solid #ccc',
      paddingTop: '15px'
    },
    savedTeamItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px',
      borderBottom: '1px solid #eee'
    },
    loadBtn: {
      backgroundColor: '#FF9800',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      cursor: 'pointer',
      marginRight: '5px'
    },
    deleteBtn: {
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      cursor: 'pointer'
    }
  };

  if (loading) {
    return <div style={styles.container}>Cargando Pokémon...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Creador de Equipos Pokémon</h1>

      <div style={styles.main}>
        {/* Panel izquierdo: Lista de Pokémon */}
        <div style={styles.panel}>
          <h2>Seleccionar Pokémon</h2>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.pokemonList}>
            {filteredPokemon.map((pokemon) => {
              const id = pokemon.url.split('/')[6];
              return (
                <div key={pokemon.name} style={styles.pokemonItem}>
                  <span style={{ textTransform: 'capitalize' }}>{pokemon.name}</span>
                  <button
                    onClick={() => addToTeam(pokemon)}
                    style={styles.addBtn}
                    disabled={team.length >= 6}
                  >
                    Agregar
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel derecho: Equipo actual */}
        <div style={styles.panel}>
          <h2>Mi Equipo ({team.length}/6)</h2>
          <div style={styles.teamGrid}>
            {team.map((pokemon) => (
              <div key={pokemon.name} style={styles.teamCard}>
                <img src={pokemon.image} alt={pokemon.name} style={styles.sprite} />
                <p style={{ textTransform: 'capitalize', margin: '5px 0' }}>{pokemon.name}</p>
                <button
                  onClick={() => removeFromTeam(pokemon.name)}
                  style={styles.removeBtn}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          {/* Guardar equipo */}
          <div style={styles.saveSection}>
            <h3>Guardar equipo</h3>
            <input
              type="text"
              placeholder="Nombre del equipo"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={styles.teamNameInput}
            />
            <button onClick={saveTeam} style={styles.saveBtn}>
              Guardar
            </button>
          </div>

          {/* Equipos guardados */}
          <div style={styles.savedTeamsList}>
            <h3>Equipos guardados</h3>
            {savedTeams.length === 0 ? (
              <p>No hay equipos guardados.</p>
            ) : (
              savedTeams.map((saved) => (
                <div key={saved.id} style={styles.savedTeamItem}>
                  <span>
                    <strong>{saved.name}</strong> ({saved.members.length} Pokémon)
                  </span>
                  <div>
                    <button
                      onClick={() => loadTeam(saved)}
                      style={styles.loadBtn}
                    >
                      Cargar
                    </button>
                    <button
                      onClick={() => deleteSavedTeam(saved.id)}
                      style={styles.deleteBtn}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;