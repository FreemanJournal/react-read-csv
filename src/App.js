import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useCSVReader } from 'react-papaparse';
import { useDispatch } from "react-redux";
import './App.css';
import EnhancedTable from "./components/Table";
import { setProductList } from "./redux/state/products.slice";
const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  browseFile: {
    width: '20%',
  },
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  },
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  },
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  },
};
function App() {
  const dispatch = useDispatch();
  const { CSVReader } = useCSVReader();
  let url = "http://localhost:5000/api/v1/product"
  function onUploadHandler(results) {
    // dispatch(setProductList(results))
    console.log("results", results);
    axios.post(url, { data: results })
      .then(({ data }) => console.log("Data results", data))
      .catch(err => console.log("err", err))
  }
  return (
    <Stack sx={{ marginTop: "1em" }} className="App">
      <Box>
        <Button variant='contained' htmlFor="file_input_field" sx={{ width: "10em", mx: "auto" }} component="label">
          Upload CSV
        </Button>
        <input
          id="file_input_field"
          type="file"
          hidden
          onChange={(e) => onUploadHandler(e.target.files)}
        />
        {/* <Typography>{acceptedFile && acceptedFile.name}</Typography>
        <Button variant='contained' sx={{ width: "10em", mx: "auto" }} >Remove</Button> */}
      </Box>
      {/* <EnhancedTable /> */}
    </Stack>
  );
}

export default App;
