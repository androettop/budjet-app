import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Slider,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ThemeSandboxPage = () => {
  const [sliderValue, setSliderValue] = useState(30);
  const [rating, setRating] = useState<number | null>(4);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("option1");
  const [selectValue, setSelectValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Seleccionar campaña",
    "Crear un grupo de anuncios",
    "Crear un anuncio",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      {/* Title */}
      <Typography variant="h3" component="h1" gutterBottom>
        Material UI Components Showcase
      </Typography>

      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Inicio
        </Link>
        <Link underline="hover" color="inherit" href="/sandbox">
          Sandbox
        </Link>
        <Typography color="text.primary">Componentes</Typography>
      </Breadcrumbs>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_e, newValue) => setTabValue(newValue)}
        >
          <Tab label="Formularios" />
          <Tab label="Navegación" />
          <Tab label="Feedback" />
          <Tab label="Datos" />
        </Tabs>
      </Box>

      {/* Tab Panel 1: Forms */}
      <CustomTabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Buttons */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Botones
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                  <Button variant="contained">Contained</Button>
                  <Button variant="outlined">Outlined</Button>
                  <Button variant="text">Text</Button>
                  <Button variant="contained" color="secondary">
                    Secondary
                  </Button>
                  <Button variant="contained" disabled>
                    Disabled
                  </Button>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Fab color="primary" aria-label="add">
                    <AddIcon />
                  </Fab>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <Tooltip title="Eliminar">
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Form Controls */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Controles de Formulario
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Nombre"
                    variant="outlined"
                    placeholder="Ingresa tu nombre"
                  />
                  <TextField
                    label="Email"
                    type="email"
                    variant="filled"
                    helperText="Ingresa un email válido"
                  />
                  <TextField
                    label="Mensaje"
                    multiline
                    rows={3}
                    variant="standard"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={selectValue}
                      label="Categoría"
                      onChange={(e) => setSelectValue(e.target.value)}
                    >
                      <MenuItem value="tech">Tecnología</MenuItem>
                      <MenuItem value="health">Salud</MenuItem>
                      <MenuItem value="education">Educación</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Switches and Checkboxes */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Selecciones
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchChecked}
                        onChange={(e) => setSwitchChecked(e.target.checked)}
                      />
                    }
                    label="Notificaciones"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkboxChecked}
                        onChange={(e) => setCheckboxChecked(e.target.checked)}
                      />
                    }
                    label="Acepto términos y condiciones"
                  />

                  <FormControl>
                    <FormLabel>Preferencia</FormLabel>
                    <RadioGroup
                      value={radioValue}
                      onChange={(e) => setRadioValue(e.target.value)}
                    >
                      <FormControlLabel
                        value="option1"
                        control={<Radio />}
                        label="Opción 1"
                      />
                      <FormControlLabel
                        value="option2"
                        control={<Radio />}
                        label="Opción 2"
                      />
                      <FormControlLabel
                        value="option3"
                        control={<Radio />}
                        label="Opción 3"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sliders and Rating */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Valores
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography gutterBottom>Volumen: {sliderValue}</Typography>
                    <Slider
                      value={sliderValue}
                      onChange={(_e, newValue) =>
                        setSliderValue(newValue as number)
                      }
                      aria-labelledby="continuous-slider"
                    />
                  </Box>

                  <Box>
                    <Typography gutterBottom>Calificación</Typography>
                    <Rating
                      value={rating}
                      onChange={(_e, newValue) => setRating(newValue)}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* Tab Panel 2: Navigation */}
      <CustomTabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Stepper */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Stepper
                </Typography>
                <Stepper activeStep={activeStep}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Atrás
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {activeStep === steps.length - 1 ? (
                    <Button onClick={handleReset}>Reset</Button>
                  ) : (
                    <Button onClick={handleNext}>Siguiente</Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Accordion */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Accordion
                </Typography>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Sección 1</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Sección 2</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>

          {/* Lists */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Listas
                </Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Juan Pérez"
                      secondary="Desarrollador Frontend"
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary="juan@example.com"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Teléfono"
                      secondary="+1 234 567 890"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* Tab Panel 3: Feedback */}
      <CustomTabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Alerts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Alertas
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Alert severity="success">
                    <AlertTitle>Éxito</AlertTitle>
                    Operación completada correctamente.
                  </Alert>
                  <Alert severity="info">
                    Información importante para el usuario.
                  </Alert>
                  <Alert severity="warning">
                    Advertencia: Revisa los datos ingresados.
                  </Alert>
                  <Alert severity="error">
                    Error: No se pudo completar la operación.
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Progress */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Progreso
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography gutterBottom>Progreso Lineal</Typography>
                    <LinearProgress variant="determinate" value={75} />
                  </Box>
                  <Box>
                    <Typography gutterBottom>Progreso Indeterminado</Typography>
                    <LinearProgress />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography>Circular:</Typography>
                    <CircularProgress size={24} />
                    <CircularProgress variant="determinate" value={60} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Badges and Chips */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Badges y Chips
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                  <Badge badgeContent={4} color="primary">
                    <EmailIcon />
                  </Badge>
                  <Badge badgeContent={99} color="secondary">
                    <EmailIcon />
                  </Badge>
                  <Badge variant="dot" color="error">
                    <EmailIcon />
                  </Badge>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label="React" color="primary" />
                  <Chip label="TypeScript" color="secondary" />
                  <Chip
                    label="Material UI"
                    color="success"
                    icon={<FavoriteIcon />}
                  />
                  <Chip
                    label="Deleteable"
                    color="warning"
                    onDelete={() => {}}
                  />
                  <Chip
                    label="Clickable"
                    color="info"
                    onClick={() => alert("Chip clicked!")}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Dialog and Snackbar triggers */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Modales y Notificaciones
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setDialogOpen(true)}
                  >
                    Abrir Dialog
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setSnackbarOpen(true)}
                  >
                    Mostrar Snackbar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* Tab Panel 4: Data Display */}
      <CustomTabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {/* Table */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Tabla
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell align="right">Edad</TableCell>
                        <TableCell align="right">Ciudad</TableCell>
                        <TableCell align="right">Puntuación</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Ana García
                        </TableCell>
                        <TableCell align="right">28</TableCell>
                        <TableCell align="right">Madrid</TableCell>
                        <TableCell align="right">
                          <Rating value={5} readOnly size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Carlos López
                        </TableCell>
                        <TableCell align="right">34</TableCell>
                        <TableCell align="right">Barcelona</TableCell>
                        <TableCell align="right">
                          <Rating value={4} readOnly size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          María Rodríguez
                        </TableCell>
                        <TableCell align="right">31</TableCell>
                        <TableCell align="right">Valencia</TableCell>
                        <TableCell align="right">
                          <Rating value={3} readOnly size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Cards showcase */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: "primary.main", mb: 2 }}>
                  <StarIcon />
                </Avatar>
                <Typography gutterBottom variant="h5" component="div">
                  Producto Premium
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Comprar</Button>
                <Button size="small">Más Info</Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: "secondary.main", mb: 2 }}>
                  <SettingsIcon />
                </Avatar>
                <Typography gutterBottom variant="h5" component="div">
                  Configuración
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Configurar</Button>
                <Button size="small">Ayuda</Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Avatar sx={{ bgcolor: "success.main", mb: 2 }}>
                  <EmailIcon />
                </Avatar>
                <Typography gutterBottom variant="h5" component="div">
                  Contacto
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Contactar</Button>
                <Button size="small">Ver Más</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Ejemplo de Dialog"}</DialogTitle>
        <DialogContent>
          <Typography>
            Este es un ejemplo de un dialog de Material UI. Puedes usar dialogs
            para mostrar información importante, confirmaciones, o formularios
            modales.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="¡Snackbar mostrado exitosamente!"
        action={
          <Button
            color="secondary"
            size="small"
            onClick={() => setSnackbarOpen(false)}
          >
            CERRAR
          </Button>
        }
      />
    </Box>
  );
};

export default ThemeSandboxPage;
