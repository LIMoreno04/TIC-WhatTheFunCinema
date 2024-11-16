import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  styled,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import axios from "axios";

const ErrorMessage = styled(Typography)({
  color: "pink",
  fontWeight: "bold",
  textShadow: "0 0 5px cyan",
  marginBottom: "10px",
});

const Overlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
});

const AddSnackForm = () => {
  const [snackData, setSnackData] = useState({
    name: "",
    price: "",
    description: "",
    picture: null,
    url: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSnackData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSnackData((prevData) => ({
      ...prevData,
      picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", snackData.name);
    formData.append("price", snackData.price);
    formData.append("description", snackData.description);
    formData.append("picture", snackData.picture);
    formData.append("url", snackData.url);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/snacks/addSnack",
        formData,
        { withCredentials: true }
      );
      setMessage(response.data);
      setErrors({});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data);
      } else {
        setMessage("Error al agregar el snack.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative">
      {loading && (
        <Overlay>
          <CircularProgress />
        </Overlay>
      )}
      <Paper
        sx={{
          border: "2px solid #9df8fc",
          borderRadius: "30px",
          padding: "40px",
          maxWidth: "600px",
          margin: "auto",
          opacity: loading ? 0.5 : 1,
        }}
      >
        <Box align="center" mb={3}>
          <Typography variant="h4" color="#9df8fc">
            Agregar Snack
          </Typography>
        </Box>
        {message && (
          <Typography color="#9df8fc" mb={2}>
            {message}
          </Typography>
        )}
        {Object.keys(errors).length > 0 && (
          <ErrorMessage>Por favor corrige los errores marcados.</ErrorMessage>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Nombre"
              name="name"
              value={snackData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
            />
            <TextField
              label="Precio"
              name="price"
              type="number"
              value={snackData.price}
              onChange={handleChange}
              error={Boolean(errors.price)}
              helperText={errors.price}
              fullWidth
            />
            <TextField
              label="Descripción"
              name="description"
              value={snackData.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="URL"
              name="url"
              value={snackData.url}
              onChange={handleChange}
              error={Boolean(errors.url)}
              helperText={errors.url}
              fullWidth
            />
            <Paper
              elevation={3}
              sx={{
                border: "2px solid #e4b4e6",
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
              }}
              onClick={() => document.getElementById("file-input").click()}
            >
              <ImageIcon fontSize="large" />
              <Typography variant="subtitle1">
                {snackData.picture ? snackData.picture.name : "Sube una imagen"}
              </Typography>
            </Paper>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Agregar Snack
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddSnackForm;
