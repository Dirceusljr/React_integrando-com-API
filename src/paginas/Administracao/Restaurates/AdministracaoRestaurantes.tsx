import { useEffect, useState } from "react";
import IRestaurante from "../../../interfaces/IRestaurante";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const AdministracaoRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v2/restaurantes/")
      .then((res) => setRestaurantes(res.data));
  }, []);

  const excluir = (restauranteASerExcluido: IRestaurante) => {
    axios.delete(`http://localhost:8000/api/v2/restaurantes/${restauranteASerExcluido.id}/`)
      .then( res => {
        const novaListaDeRestaurantes = restaurantes.filter( restaurante => restaurante.id !== restauranteASerExcluido.id)
        setRestaurantes([...novaListaDeRestaurantes])
      })
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Editar</TableCell>
            <TableCell>Excluir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurantes.map((restaurante) => (
            <TableRow key={restaurante.id}>
              <TableCell>{restaurante.nome}</TableCell>
              <TableCell>
                [ <Link to={`/admin/restaurantes/${restaurante.id}`}>editar</Link> ]
              </TableCell>
              <TableCell>
                <Button color="error" variant="outlined" onClick={() => excluir(restaurante)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdministracaoRestaurantes;
