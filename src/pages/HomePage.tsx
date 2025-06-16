import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { Movement } from "../types/movements";
import { useEffect, useState } from "react";
import { EncryptedDB } from "../data/db";
import { useUserData } from "../hooks/useUserData";
import useDbLock from "../hooks/useDbLock";

const HomePage = () => {
  const [movementData, setMovementData] = useState<Movement>({
    date: new Date().toISOString().substring(0, 10),
    amount: 0,
    category: "",
    expense: true,
    description: "",
  });

  const [movements, setMovements] = useState<Movement[]>([]);

  const user = useUserData();

  const { isDbLocked } = useDbLock();

  const handleSave = () => {
    EncryptedDB.getInstance().addDoc(
      `/users/${user?.uid}/movements`,
      movementData,
    );
  };

  useEffect(() => {
    if (user && !isDbLocked) {
      EncryptedDB.getInstance()
        .getDocs(`/users/${user?.uid}/movements`)
        .then((docs) => {
          setMovements(docs.map((doc) => doc.data as Movement));
        });
    }
  }, [user, isDbLocked]);

  if (!user?.uid || isDbLocked) return null;

  return (
    <Box paddingY={4}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h5">Cargar Gasto/Ingreso</Typography>
                <ToggleButtonGroup
                  color="primary"
                  sx={{ width: "100%" }}
                  value={movementData.expense}
                  exclusive
                  onChange={(_event, value) => {
                    if (value === null) return;
                    setMovementData({ ...movementData, expense: value });
                  }}
                  aria-label="Tipo de movimiento"
                >
                  <ToggleButton sx={{ flex: 1 }} value={true}>
                    Gasto
                  </ToggleButton>
                  <ToggleButton sx={{ flex: 1 }} value={false}>
                    Ingreso
                  </ToggleButton>
                </ToggleButtonGroup>
                <TextField
                  label="Monto"
                  type="number"
                  value={movementData.amount}
                  onChange={(event) =>
                    setMovementData({
                      ...movementData,
                      amount: Number(event.target.value),
                    })
                  }
                  fullWidth
                  required
                />
                <TextField
                  label="Descripción"
                  value={movementData.description}
                  onChange={(event) =>
                    setMovementData({
                      ...movementData,
                      description: event.target.value,
                    })
                  }
                  fullWidth
                  required
                />
                <TextField
                  label="Fecha"
                  type="date"
                  value={movementData.date}
                  onChange={(event) =>
                    setMovementData({
                      ...movementData,
                      date: event.target.value,
                    })
                  }
                  fullWidth
                  required
                />
                <TextField
                  label="Categoría"
                  value={movementData.category}
                  onChange={(event) =>
                    setMovementData({
                      ...movementData,
                      category: event.target.value,
                    })
                  }
                  fullWidth
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  fullWidth
                >
                  Guardar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={6}>
          <List>
            {movements.map((movement) => (
              <ListItem key={movement.description}>
                <ListItemText
                  primary={movement.description}
                  secondary={`${movement.amount}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
