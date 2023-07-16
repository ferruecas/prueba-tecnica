import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  useEffect(() => {
    ConsultarUsuarios();
  }, []);

  const [userList, setUserList] = useState([]);
  const [userListOri, setUserListOri] = useState([]);
  const [isColored, setIsColored] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");

  const DELETE = (index) => {
    const updatedUserList = [...userList];
    updatedUserList.splice(index, 1);
    setUserList(updatedUserList);
  };

  const restart = () => {
    setUserList([...userListOri]);
  };

  const ConsultarUsuarios = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=100', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      debugger
      if (!response.ok) {
        throw new Error('Pagina no respone');
      }

      const jsonData = await response.json();
      const userListData = jsonData.results;

      setUserList(userListData);
      setUserListOri(userListData); // Almacenar la lista original solo una vez
    } catch (error) {
      alert('Error Obteniendo data:' + error);
    }
  };

  const toggleColor = () => {
    setIsColored(!isColored);
  };

  const handleSortByCountry = () => {
    const sortedData = [...userList].sort((a, b) => {
      const countryA = a.location.country.toLowerCase();
      const countryB = b.location.country.toLowerCase();

      if (countryA < countryB) {
        return isDescending ? 1 : -1;
      }
      if (countryA > countryB) {
        return isDescending ? -1 : 1;
      }
      return 0;
    });

    setUserList(sortedData);
    setIsDescending(!isDescending);
  };

  const filterByCountry = (query) => {
    setCountryQuery(query);
    if (query.trim() === "") {
      setUserList([...userListOri]); // Restaurar la lista original directamente
    } else {
      const filteredData = userListOri.filter(
        (data) =>
          data.location.country.toLowerCase().includes(query.toLowerCase())
      );
      setUserList(filteredData);
    }
  };

  return (
    <React.Fragment>
      <h1>Lista de usuarios</h1>
      <header>
        <button onClick={() => restart()}>Restaurar</button>
        <button onClick={toggleColor}>
          {isColored ? 'Quitar Color' : 'Añadir Color'}
        </button>
        <button onClick={handleSortByCountry}>Ordenar por País</button>
        <input
          type="text"
          placeholder="Consultar por país..."
          value={countryQuery}
          onChange={(e) => filterByCountry(e.target.value)}
        />
      </header>
      <main>
        <table width="100%">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((data, index) => (
              <tr
                key={index}
                className={(isColored ? (index % 2 === 0 ? 'row-1' : 'row-2') : '') + ' rowClass'}
              >
                <td><img src={data.picture.large} alt="Photography Alicia Manzanares"></img></td>
                <td>{data.name.first}</td>
                <td>{data.name.last}</td>
                <td>{data.location.country}</td>
                <td>
                  <button onClick={() => DELETE(index)}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </React.Fragment>
  );
}

export default App;
