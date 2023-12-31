import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  useEffect(() => {
    ConsultarUsuarios();
  }, []);

  const [userList, setUserList] = useState([]);
  const [isColored, setIsColored] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");

  const ConsultarUsuarios = async () => {
    try {
      const response = await fetch("https://randomuser.me/api/?results=100", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Pagina no respone");
      }

      const jsonData = await response.json();
      const userListData = jsonData.results;

      // for (let index = 0; index < userListData.length; index++) {
      //   const element = userListData[index];
      //   //se agregan propiedades al listado
      //   element["visible"] = false;
      //   element["filter"] = false;
      //   element["id"] = index;
        
      //   Listado.push(element);
      // }

     let Listado = userListData.map((element, index) => ({
        ...element,
        visible: false,
        filter: false,
        id: index
      }));


      setUserList(Listado);
    } catch (error) {
      alert("Error Obteniendo data:" + error);
    }
  };
  
  const DELETE = (index) => {
    const updatedUserList = [...userList];
    updatedUserList[index].visible = true;
    setUserList(ChangeColor(isColored, updatedUserList));
  };

  const restart = () => {
    let Listado = [...userList];

    // for (let index = 0; index < Listado.length; index++) {
    //   Listado[index]["visible"] = false;
    // }
    Listado=Listado.map((data) => ({
      ...data,
      visible: false
    }));

    setUserList(ChangeColor(isColored, Listado));
  };

  const toggleColor = () => {
    let Listado = [...userList];
    setIsColored(!isColored);   

    setUserList(ChangeColor(!isColored, Listado));
  };

  const ChangeColor = (state, Listado) => {
    let row = "";
    for (let index = 0; index < Listado.length; index++) {
      if (Listado[index]["visible"] || Listado[index]["filter"] || !state) {
        Listado[index]["color"] = "";
      } else {
        if (row === "row-1") {
          Listado[index]["color"] = "row-2";
          row = "row-2";
        } else {
          Listado[index]["color"] = "row-1";
          row = "row-1";
        }
      }
    }
    return Listado;
  };

  const handleSort = (field) => {
    const sortedData = [...userList].sort((a, b) => {
      let A = "";
      let B = "";
      if (field === "country") {
        A = a.location[field].toLowerCase();
        B = b.location[field].toLowerCase();
      } else {
        A = a.name[field].toLowerCase();
        B = b.name[field].toLowerCase();
      }

      if (A < B) {
        return isDescending ? 1 : -1;
      }
      if (A > B) {
        return isDescending ? -1 : 1;
      }
      return 0;
    });

    setUserList(ChangeColor(isColored, sortedData));
    setIsDescending(!isDescending);
  };

  const filterByCountry = (value) => {
    
    setCountryQuery(value);

    if (value.trim() === "") {
      let Listado = [];
      for (let index = 0; index < userList.length; index++) {
        const element = userList[index];
        element["filter"] = false;
        Listado.push(element);
      }
      setUserList(ChangeColor(isColored, Listado));
    } else {
      let Listado = [...userList];
      const filteredData = Listado.filter((data) =>
        data.location.country.toLowerCase().includes(value.toLowerCase())
      );
      for (let index = 0; index < Listado.length; index++) {
        Listado[index]["filter"] = true;//propiedad de la tabla
        for (let index2 = 0; index2 < filteredData.length; index2++) {

          if (Listado[index].id === filteredData[index2].id) {
            Listado[index]["filter"] = false;
          }

        }
      }
      setUserList(ChangeColor(isColored, Listado));
    }
  };

  return (
    <React.Fragment>
      <h1>Lista de usuarios</h1>
      <header>
        <button onClick={() => restart()}>Restaurar</button>
        <button onClick={toggleColor}>
          {isColored ? "Quitar Color" : "Añadir Color"}
        </button>
        <button onClick={() => handleSort("country")}>Ordenar por País</button>
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
              <th onClick={() => handleSort("first")}>Nombre</th>
              <th onClick={() => handleSort("last")}>Apellido</th>
              <th onClick={() => handleSort("country")}>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((data, index) => (
              <tr
                hidden={data.visible || data.filter}
                className={data.color}
              >
                <td>
                  <img
                    src={data.picture.thumbnail}
                    alt={data.name.first+" "+data.name.last}
                  ></img>
                </td>
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