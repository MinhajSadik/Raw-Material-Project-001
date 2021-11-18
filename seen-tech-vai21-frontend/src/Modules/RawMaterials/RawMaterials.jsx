import {
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosGitCompare, IoIosPaper } from "react-icons/io";
import { apiBaseUrl } from "../../config.json";

const useStyles = makeStyles((theme) => ({
  Button: {
    marginRight: theme.spacing(1),
  },
  Switch: {
    textAlign: "center",
  },
  Paper: {
    width: "100%",
    height: "100%",
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  Table: {
    marginTop: "40px",
  },
  TextField: {
    marginTop: theme.spacing(1),
  },
  ActiveColor: {
    color: "green",
  },
  InactiveColor: {
    color: "red",
  },
  MarginLeft: {
    marginLeft: theme.spacing(4),
  },
  MarginBottom: {
    marginBottom: theme.spacing(1),
  },
}));

const initialMaterial = {
  name: "",
  price: "",
  status: true,
  diameter: "",
  diameteruomid: null,
  length: "",
  lengthuomid: null,
  weight: "",
  weightuomid: null,
  thickness: "",
  thicknessuomid: null,
};

const viewModesVIEW = "VIEW";
const viewModesNEW = "NEW";
const viewModesEDIT = "EDIT";
const viewModesTOBEEIDT = "ToBeEdited";

const RawMaterials = () => {
  const classes = useStyles();

  const [currentMaterial, setCurrentMaterial] = useState(initialMaterial);
  const [allMaterial, setAllMaterial] = useState([]);
  const [viewMode, setViewMode] = useState(viewModesVIEW);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailure, setOpenFailure] = useState(false);

  const [allUom, setAllUom] = useState([]);
  const [diameter, setDiameter] = useState(null);
  const [length, setLength] = useState(null);
  const [weight, setWeight] = useState(null);
  const [thickness, setThickness] = useState(null);

  //All UOM Materials//
  const handleGetAllUomMaterial = async () => {
    await Axios({
      method: "GET",
      url: `${apiBaseUrl}/units_of_measurement/get_all`,
      data: JSON.stringify({}),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        res.data ? setAllUom(res?.data?.result) : setAllUom([]);
      })
      .catch((err) => {
        console.log(err);
      });
    clear();
  };

  //Save UOM Materials//
  // eslint-disable-next-line no-unused-vars
  const handleSaveUomMaterial = async () => {
    await Axios({
      method: "POST",
      url: `${apiBaseUrl}/units_of_measurement/new`,
      data: JSON.stringify(),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        res.data ? setAllUom(res.data.result) : setAllUom([]);
      })
      .catch((err) => {
        console.log(err);
      });
    clear();
  };

  //Modifying UOM Materials//
  // eslint-disable-next-line no-unused-vars
  const handleModifyUomMaterial = async (id) => {
    await Axios({
      method: "PUT",
      url: `${apiBaseUrl}/units_of_measurement/modify/${id}`,
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify(currentMaterial),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setOpenFailure(err.response.data);
      });
    clear();
  };

  //Modifying Materials//
  const handleModifyMaterial = async () => {
    const data = {
      ...currentMaterial,
      diameteruomid: currentMaterial.diameteruomid._id,
      lengthuomid: currentMaterial.lengthuomid._id,
      weightuomid: currentMaterial.weightuomid._id,
      thicknessuomid: currentMaterial.thicknessuomid._id,
    };

    await Axios({
      method: "PUT",
      url: `${apiBaseUrl}/material/modify/`,
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
        setOpenSuccess(true);
      })
      .catch((err) => {
        setOpenFailure(err.response.data);
      });
    clear();
  };

  //Save Materials//
  const handleSaveNewMaterial = async (data) => {
    data.diameter = parseFloat(data.diameter);
    data.length = parseFloat(data.length);
    data.weight = parseFloat(data.weight);
    data.thickness = parseFloat(data.thickness);

    data.diameteruomid = data.diameteruomid._id;
    data.lengthuomid = data.lengthuomid._id;
    data.weightuomid = data.weightuomid._id;
    data.thicknessuomid = data.thicknessuomid._id;

    console.log("data", data);

    await Axios({
      method: "POST",
      url: `${apiBaseUrl}/material/new`,
      data: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        setOpenSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setOpenFailure(err.response.data);
      });
    clear();
  };

  //Get All Material//
  const handleGetAllMaterial = async () => {
    await Axios({
      method: "GET",
      url: `${apiBaseUrl}/material/get_all/populated`,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        setAllMaterial(res?.data?.result);
        // console.log(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Toggle Materials Status//
  const toggleStatus = async (id, status) => {
    setCurrentMaterial({ ...currentMaterial, status: status });
    var newValue = {
      ...currentMaterial,
      status: status,
    };

    await Axios({
      method: "PUT",
      url: `${apiBaseUrl}/material/set_status/${id}/${status}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(newValue),
    })
      .then((res) => {
        console.log("Modifying Options successfully  ", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Get All Material useEffect Call//
  useEffect(() => {
    handleGetAllMaterial();
  }, [currentMaterial]);

  //Set UOM Material useEffect//
  useEffect(() => {
    console.log(currentMaterial);
    if (currentMaterial) {
      setDiameter(currentMaterial.diameteruomid);
      setLength(currentMaterial.lengthuomid);
      setWeight(currentMaterial.weightuomid);
      setThickness(currentMaterial.thicknessuomid);
    }
  }, [currentMaterial]);

  //Get All UOM useEffect Call//
  useEffect(() => {
    handleGetAllUomMaterial();
    // console.log(allUom);
  }, []);

  //State Clear Materials//
  const clear = () => {
    setCurrentMaterial(initialMaterial);
    setViewMode(viewModesVIEW);
  };

  //Table Data Edited Function//
  const handleChange = (material) => {
    setCurrentMaterial({ ...material, _id: material._id });
    setViewMode(viewModesTOBEEIDT);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} className={classes.root}>
          <Button
            style={{ marginRight: "10px" }}
            variant="contained"
            color="secondary"
            size="small"
            disabled={viewMode === viewModesEDIT}
            onClick={(e) => {
              setCurrentMaterial(initialMaterial);
              setViewMode(viewModesNEW);
            }}
          >
            CREATE NEW
          </Button>

          <Button
            className={classes.Button}
            variant="contained"
            color="secondary"
            size="small"
            disabled={
              viewMode === viewModesNEW ||
              viewMode === viewModesVIEW ||
              viewMode === viewModesEDIT
            }
            onClick={(e) => {
              setViewMode(viewModesEDIT);
            }}
          >
            EDIT
          </Button>

          <Button
            variant="contained"
            color="primary"
            className={classes.Button}
            size="small"
            disabled={viewMode !== viewModesNEW && viewMode !== viewModesEDIT}
            onClick={(e) => {
              if (viewMode === viewModesNEW) {
                handleSaveNewMaterial(currentMaterial);
              } else {
                handleModifyMaterial();
              }
            }}
          >
            SAVE
          </Button>

          <Button
            variant="contained"
            className={classes.Button}
            size="small"
            onClick={(e) => {
              clear();
            }}
          >
            CANCEL
          </Button>
        </Grid>
        <Paper className={classes.Paper}>
          <Collapse in={openSuccess} timeout="auto">
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenSuccess(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {openSuccess}
              Saved Materials Successfully
            </Alert>
          </Collapse>

          <Collapse in={openFailure} timeout="auto">
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenFailure(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {openFailure}
            </Alert>
          </Collapse>
          <Grid item xs={12} className={classes.Switch}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentMaterial.status}
                  disabled={
                    viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                  }
                  onChange={(e) =>
                    setCurrentMaterial({
                      ...currentMaterial,
                      status: e.target.checked,
                    })
                  }
                  name="checkedB"
                  color="primary"
                />
              }
              label="Active"
            />
          </Grid>
          <Grid container spacing={1} className={classes.TextField}>
            <Grid item xs={6}>
              <TextField
                size="small"
                value={currentMaterial.name}
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                onChange={(e) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    name: e.target.value,
                  });
                }}
                id="outlined-besic"
                label="RAW MATERIAL NAME"
                required
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                value={currentMaterial.price}
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                type="number"
                onChange={(e) =>
                  setCurrentMaterial({
                    ...currentMaterial,
                    price: parseFloat(e.target.value),
                  })
                }
                id="outlined-besic"
                label="PRICE"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>

          {/* units_of_measurement starting*/}

          <Grid container className={classes.TextField} spacing={1}>
            <Grid item xs={3}>
              <TextField
                value={currentMaterial.diameter}
                size="small"
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                onChange={(e) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    diameter: e.target.value,
                  });
                }}
                id="outlined-besic"
                label="DIAMETER"
                required
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={3} spacing={1}>
              <Autocomplete
                className={classes.MarginLeft}
                id="combo-box-demo"
                size="small"
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                value={diameter}
                options={allUom}
                onChange={(e, newValue) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    diameteruomid: newValue,
                  });
                }}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="UOM" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={currentMaterial.length}
                size="small"
                type="number"
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                onChange={(e) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    length: parseFloat(e.target.value),
                  });
                }}
                id="outlined-besic"
                label="LENGTH"
                required
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                className={classes.MarginLeft}
                id="combo-box-demo"
                size="small"
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                value={length}
                options={allUom}
                onChange={(e, newValue) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    lengthuomid: newValue,
                  });
                }}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="UOM" variant="outlined" />
                )}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.TextField} spacing={1}>
            <Grid item xs={3}>
              <TextField
                value={currentMaterial.weight}
                size="small"
                type="number"
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                onChange={(e) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    weight: parseFloat(e.target.value),
                  });
                }}
                id="outlined-besic"
                label="WEIGHT"
                required
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                className={classes.MarginLeft}
                id="combo-box-demo"
                size="small"
                type="number"
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                value={weight}
                options={allUom}
                onChange={(e, newValue) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    weightuomid: newValue,
                  });
                }}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="UOM" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={currentMaterial.thickness}
                size="small"
                type="number"
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                onChange={(e) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    thickness: parseFloat(e.target.value),
                  });
                }}
                id="outlined-besic"
                label="THICKNESS"
                required
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                className={classes.MarginLeft}
                id="combo-box-demo"
                size="small"
                disabled={
                  viewMode !== viewModesNEW && viewMode !== viewModesEDIT
                }
                value={thickness}
                options={allUom}
                onChange={(e, newValue) => {
                  setCurrentMaterial({
                    ...currentMaterial,
                    thicknessuomid: newValue,
                  });
                }}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="UOM" variant="outlined" />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Grid container>
          <Grid item xs={12}>
            <TableContainer className={classes.Table} component={Paper}>
              <Table aria-label="simple-table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>ACTIONS</b>
                    </TableCell>
                    <TableCell>
                      <b>NAME</b>
                    </TableCell>
                    <TableCell>
                      <b>PRICE</b>
                    </TableCell>
                    <TableCell>
                      <b>DIAMETER</b>
                    </TableCell>
                    <TableCell>
                      <b>LENGTH</b>
                    </TableCell>
                    <TableCell>
                      <b>WEIGHT</b>
                    </TableCell>
                    <TableCell>
                      <b>THICKNESS</b>
                    </TableCell>
                    <TableCell>
                      <b>STATUS</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {allMaterial.map((material) => (
                    <TableRow key={material._id}>
                      <TableCell component="th" scope="row">
                        <Button
                          className={classes.Button}
                          variant="contained"
                          color="primary"
                          onClick={() => handleChange(material)}
                        >
                          <IoIosPaper />
                        </Button>

                        <Button
                          className={classes.Button}
                          variant="contained"
                          color="primary"
                          value={currentMaterial.status}
                          onClick={(e) => {
                            material.status
                              ? toggleStatus(material._id, "inactive")
                              : toggleStatus(material._id, "active");
                          }}
                        >
                          <IoIosGitCompare />
                        </Button>
                      </TableCell>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.price}</TableCell>
                      <TableCell>
                        {material.diameter}
                        &nbsp;
                        {material.diameteruomid.name}
                      </TableCell>
                      <TableCell>
                        {material.length}
                        &nbsp;
                        {material.lengthuomid.name}
                      </TableCell>
                      <TableCell>
                        {material.weight}
                        &nbsp;
                        {material.weightuomid.name}
                      </TableCell>
                      <TableCell>
                        {material.thickness}
                        &nbsp;
                        {material.thicknessuomid.name}
                      </TableCell>
                      {material.status ? (
                        <TableCell className={classes.ActiveColor}>
                          Active
                        </TableCell>
                      ) : (
                        <TableCell className={classes.InactiveColor}>
                          Inactive
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RawMaterials;
