import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const FormularioRestaurante = () => {
  const [novoRestaurante, setNovoRestaurante] = useState("");

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    axios
      .post("http://localhost:8000/api/v2/restaurantes/", {
        nome: novoRestaurante,
      })
      .then(() => {
        alert("Restaurante cadastrado com sucesso!");
      });
  };

  return (
    <form onSubmit={aoSubmeterForm}>
      <TextField
        value={novoRestaurante}
        onChange={(evento) => setNovoRestaurante(evento.target.value)}
        label="Novo Restaurante"
        variant="standard"
      />
      <Button type="submit" variant="outlined">
        Cadastrar
      </Button>
    </form>
  );
};

export default FormularioRestaurante;
