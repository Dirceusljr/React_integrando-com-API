import { useEffect, useState } from "react";
import IRestaurante from "../../interfaces/IRestaurante";
import style from "./ListaRestaurantes.module.scss";
import Restaurante from "./Restaurante";
import axios from "axios";
import { IPaginacao } from "../../interfaces/IPaginacao";
import { TextField } from "@mui/material";

const ListaRestaurantes = () => {
  
  //Paginação com botões Próxima Página e Página Anterior

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState("");
  const [paginaAnterior, setPaginaAnterior] = useState("");

  useEffect(() => {
    carregarDados("http://localhost:8000/api/v1/restaurantes/");
  }, []);

  const carregarDados = (url: string) => {
    axios
      .get<IPaginacao<IRestaurante>>(url)
      .then((response) => {
        setRestaurantes(response.data.results);
        setProximaPagina(response.data.next);
        setPaginaAnterior(response.data.previous);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filtrarRestaurante = (evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/', {
      params: {
        search: evento.target.value
      }
    })
      .then( res => {
        // const listaFiltrada = restaurantes.filter(restaurante => restaurante.id === res.data.results)
        setRestaurantes(res.data.results)
      })
  }

  return (
    <section className={style.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>
      <form>
      <TextField id="outlined-basic" label="Procure seu restaurante aqui" variant="outlined" color="primary" onChange={filtrarRestaurante} />
      </form>
      {restaurantes?.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}
      {paginaAnterior && (
        <button onClick={() => carregarDados(paginaAnterior)}>
          Página Anterior
        </button>
      )}
      {proximaPagina && (
        <button onClick={() => carregarDados(proximaPagina)}>
          Próxima Página
        </button>
      )}
    </section>
  );
};

//Paginação com Concatenção
// const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
// const [proximaPagina, setProximaPagina] = useState('');

//   useEffect(() => {
//     axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/')
//       .then(response => {
//         setRestaurantes(response.data.results)
//         setProximaPagina(response.data.next)
//       })
//       .catch(error => {
//         console.log(error)
//       })
//   }, [])

//   const verMais = () => {
//     axios.get<IPaginacao<IRestaurante>>(proximaPagina)
//     .then(response => {
//       setRestaurantes([...restaurantes, ...response.data.results])
//       setProximaPagina(response.data.next)
//     })
//     .catch(error => {
//       console.log(error)
//     })
//   }

//   return (<section className={style.ListaRestaurantes}>
//     <h1>Os restaurantes mais <em>bacanas</em>!</h1>
//     {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
//     {proximaPagina && <button onClick={verMais}>
//       Ver mais
//       </button>}
//   </section>)
// }

export default ListaRestaurantes;
