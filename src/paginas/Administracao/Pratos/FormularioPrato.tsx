import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import IRestaurante from "../../../interfaces/IRestaurante";
import http from "../../../http";
import Itags from "../../../interfaces/ITags";

const FormularioPrato = () => {
  const [nomePrato, setNomePrato] = useState("");
  const [descricaoPrato, setDescricaoPrato] = useState("");
  const [tagPrato, setTagPrato] = useState("");
  const [restaurantePrato, setRestaurantePrato] = useState("");
  const [imagemPrato, setImagemPrato] = useState<File | null>(null);


  const [listaTags, setListaTags] = useState<Itags[]>([])
  const [listaRestaurante, setListaRestaurante] = useState<IRestaurante[]>([])

  useEffect(() => {
    http.get<{tags: Itags[]}>('tags/')
        .then(resposta => setListaTags(resposta.data.tags))
    http.get<IRestaurante[]>('restaurantes/')
        .then(resposta => setListaRestaurante(resposta.data))
  }, [])

  const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if(evento.target.files?.length) {
        setImagemPrato(evento.target.files[0])
    } else {
        setImagemPrato(null)
    }
  }

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const formData = new FormData();

    formData.append('nome', nomePrato);
    formData.append('descricao', descricaoPrato);
    formData.append('tag', tagPrato);
    formData.append('restaurante', restaurantePrato);

    if(imagemPrato) {
        formData.append('imagem', imagemPrato);
    }

    http.request({
        url: 'pratos/',
        method: 'POST',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: formData
    })
    .then(() => alert('Prato cadastrado com sucesso!'))
    .catch(erro => console.log(erro))
    

  };

  return (
    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
      <Typography component="h1" variant="h6">
        Formulário de Prato
      </Typography>
      <Box component="form" sx={{width: '100%'}} onSubmit={aoSubmeterForm}>
        <TextField
          value={nomePrato}
          onChange={(evento) => setNomePrato(evento.target.value)}
          label="Novo Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <TextField
          value={descricaoPrato}
          onChange={(evento) => setDescricaoPrato(evento.target.value)}
          label="Descrição do Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <FormControl margin="dense" fullWidth>
            <InputLabel id='select-tag'>Tag</InputLabel>
            <Select labelId='select-tag' value={tagPrato} onChange={(evento) => setTagPrato(evento.target.value)}>
                {listaTags.map((tag) => (
                    <MenuItem value={tag.value} key={tag.id}>{tag.value}</MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormControl margin="dense" fullWidth>
            <InputLabel id='select-restaurante'>Restaurante</InputLabel>
            <Select labelId='select-restaurante' value={restaurantePrato} onChange={(evento) => setRestaurantePrato(evento.target.value)}>
                {listaRestaurante.map((restaurante) => (
                    <MenuItem value={restaurante.id} key={restaurante.id}>{restaurante.nome}</MenuItem>
                ))}
            </Select>
        </FormControl>

        <input type="file" onChange={selecionarArquivo} />

        <Button type="submit" variant="outlined" fullWidth sx={{marginTop: 1}}>
          Salvar
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioPrato;
