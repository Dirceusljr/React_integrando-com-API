import { useEffect, useState } from "react";
import IRestaurante from "../../interfaces/IRestaurante";
import style from "./ListaRestaurantes.module.scss";
import Restaurante from "./Restaurante";
import axios from "axios";
import { IPaginacao } from "../../interfaces/IPaginacao";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

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

  const [ordem, setOrdem] = useState<string>('');

  const aoSelecionar = (evento: SelectChangeEvent) => {
    setOrdem(evento.target.value as string)
  }

  const ordenarLista = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    axios.get<IPaginacao<IRestaurante>>(`http://localhost:8000/api/v1/restaurantes/?ordering=${ordem}`)
      .then(res => {
        setRestaurantes(res.data.results)
      })

  }

  return (
    <section className={style.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>
      <Box component="form" sx={{marginBottom: 2}}>
      <TextField id="outlined-basic" label="Procure seu restaurante aqui" variant="outlined" color="primary" onChange={filtrarRestaurante} />
      </Box>
      <Box component="form" onSubmit={ordenarLista} display="flex" columnGap={2} sx={{maxWidth: 250}}>
        <FormControl fullWidth>
          <InputLabel id="ordem">Ordenar por:</InputLabel>
          <Select labelId="ordem" id="ordem" value={ordem} label="Ordenar por:" onChange={aoSelecionar}>
            <MenuItem value={'nome'}>Nome</MenuItem>
            <MenuItem value={'id'}>Id</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit">Buscar</Button>
      </Box>
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
