import { Box, LinearProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EnhancedTable from "./components/Table";
import { setProductList } from "./redux/state/products.slice";

export default function App() {
  // const [data, setData] = useState();
const dispatch = useDispatch();
const data = useSelector(store => store.product.productList)
  useEffect(() => {
    axios(`${process.env.REACT_APP_API_URI}/files/get`).then(({ data }) =>
    dispatch(setProductList(data?.result))
    );
  }, []);

  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const progressRef = React.useRef(() => {});
  useEffect(() => {
    if(data.length > 0){
      setProgress(100);
      setBuffer(100);
    }
  },[!!data.length]);
console.log("data-result",data)


  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={buffer}
        />
      </Box>
      <EnhancedTable />
    </div>
  );
}
