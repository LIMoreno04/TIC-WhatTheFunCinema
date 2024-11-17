import { Box, CircularProgress, Paper, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";

const SnackDisplay = ({ snackId, snack: propSnack, onDisplay, detailsOnHover }) => {
  const navigate = useNavigate();
  const [snack, setSnack] = useState(propSnack || null);
  const [loading, setLoading] = useState(!propSnack); // Saltar carga si se proporciona el snack.
  const [detailsDisplay, setDetailsDisplay] = useState("none");

  const fetchSnack = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/snacks/${snackId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener el snack");
        }
        return response.json();
      })
      .then((data) => {
        setSnack(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!propSnack && snackId) {
      // Cargar el snack si no se proporciona como prop.
      setSnack(null);
      setDetailsDisplay("none");
      fetchSnack();
    }
  }, [snackId, propSnack]);

  useEffect(() => {
    if (!loading && snack) {
      const timeoutId = setTimeout(() => {
        setDetailsDisplay("flex");
      }, 1);

      return () => clearTimeout(timeoutId); // Limpiar timeout si el componente se desmonta.
    }
  }, [loading, snack]);

  const glowColor =
    onDisplay === true
      ? "#0ff0fc"
      : onDisplay === false
      ? "#c40249"
      : "#a805ad";

  const outlineColor =
    onDisplay === true
      ? "#b4e2e6"
      : onDisplay === false
      ? "#e6b4d4"
      : "#e4b4e6";

  return (
    <Paper
      onClick={() => {
        navigate(`/snack/${snackId}`);
      }}
      sx={{
        aspectRatio: "1/1",
        maxHeight: "100%",
        height: "100%",
        position: "relative",
        borderRadius: "15px",
        border: `4px solid ${outlineColor}`,
        boxShadow: `inset 0 0 20px ${glowColor}, 0 0 25px ${glowColor}, 0 0 30px ${glowColor}`,
        overflow: "hidden",
        backgroundImage: snack ? `url(${snack.picture})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: `inset 0 0 30px ${glowColor}, 0 0 45px ${glowColor}, 0 0 40px ${glowColor}`,
          "& .snack-details": {
            opacity: 1,
            visibility: "visible",
            pointerEvents: "auto",
          },
        },
      }}
    >
      {loading ? (
        <Box>
          <CircularProgress sx={{ color: glowColor }} />
          <Typography
            sx={{ color: outlineColor, marginTop: "15px", fontSize: "1rem" }}
          >
            Cargando snack...
          </Typography>
        </Box>
      ) : (
        snack && (
          detailsOnHover && (
            <>
              <Box
                className="snack-details"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: "40%",
                  background: "rgba(0, 0, 0, 0.85)",
                  padding: "clamp(6px,5%,5%)",
                  boxSizing: "border-box",
                  display: detailsDisplay,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  color: "white",
                  opacity: 0,
                  visibility: "hidden",
                  pointerEvents: "none",
                  transition: "opacity 0.35s ease-in-out, visibility 0.35s ease-in-out",
                }}
              >
                <Typography
                  variant="neonCyan"
                  fontSize="clamp(20px, 170%, 170%)"
                  sx={{
                    marginBottom: "clamp(3px, 3%, 3%)",
                    marginTop: "clamp(-2%,-2%,-3px)",
                  }}
                >
                  {snack.name.length > 16
                    ? `${snack.name.slice(0, 15)}...`
                    : snack.name}
                </Typography>

                <Typography fontSize="clamp(10px,90%,90%)" sx={{ marginBottom: "5px" }}>
                  Descripción: {snack.description}
                </Typography>
                <Typography fontSize="clamp(10px,90%,90%)" sx={{ marginBottom: "5px" }}>
                  Precio: ${snack.price}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography
                    fontSize="clamp(10px,90%,90%)"
                    sx={{ marginRight: "10px" }}
                  >
                    Disponibilidad: {snack.available ? "Sí" : "No"}
                  </Typography>
                  <Tooltip
                    title={
                      <h3>
                        {snack.available
                          ? "Disponible para compra inmediata."
                          : "Actualmente no disponible."}
                      </h3>
                    }
                  >
                    <InfoIcon
                      sx={{
                        fontSize: "clamp(10px,90%,90%)",
                        color: "#ff4081",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>
            </>
          )
        )
      )}
    </Paper>
  );
};

export default SnackDisplay;
