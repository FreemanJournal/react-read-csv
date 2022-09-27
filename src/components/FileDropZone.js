import {
    Box,
    Button,
    Stack
  } from "@mui/material";
  import axios from "axios";
  import { useEffect, useState } from "react";
  import { useCSVReader } from "react-papaparse";
  import { useDispatch } from "react-redux";
  import "./App.css";
  const styles = {};
  
  const chunkSize = 10 * 1024;
  function FileDropZone() {
    const dispatch = useDispatch();
    const { CSVReader } = useCSVReader();
    let url = "http://localhost:5000/api/v1/product/upload?";
    function onUploadHandler(results) {
      // dispatch(setProductList(results))
      console.log("results", results);
      axios
        .post(url, { data: results })
        .then(({ data }) => console.log("Data results", data))
        .catch((err) => console.log("err", err));
    }
    const [dropZoneActive, setDropZoneActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(null);
    const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(null);
  
    function handleDrop(e) {
      e.preventDefault();
      setFiles((s) => [...s, ...e.dataTransfer.files]);
    }
  
    function readAndUploadCurrentChunk() {
      const reader = new FileReader();
      const file = files[currentFileIndex];
      if (!file) {
        return;
      }
      const from = currentChunkIndex * chunkSize;
      const to = from + chunkSize;
      const blob = file.slice(from, to);
      reader.onload = (e) => uploadChunk(e);
      reader.readAsDataURL(blob);
    }
  
    function uploadChunk(readerEvent) {
      const file = files[currentFileIndex];
      const data = readerEvent.target.result;
      const params = new URLSearchParams();
      params.set("name", file.name);
      params.set("size", file.size);
      params.set("currentChunkIndex", currentChunkIndex);
      params.set("totalChunks", Math.ceil(file.size / chunkSize)); //250MB
  
      // const headers = { "Content-Type": "application/json" };
      const headers = { "Content-Type": "application/octet-stream" };
      axios
        .post(
          "http://localhost:5001/upload?" + params.toString(),
          data,
          { headers }
        )
        .then(({ data }) => {
          const file = files[currentFileIndex];
          const fileSize = files[currentFileIndex].size;
          const isLastChunk = currentChunkIndex === Math.ceil(fileSize / chunkSize) - 1
          if(isLastChunk){
            file.finalFileName = data.result
            setLastUploadedFileIndex(currentFileIndex)
            setCurrentChunkIndex(null)
          }else{
            setCurrentChunkIndex(s => s + 1)
          }
        })
        .catch((err) => console.log("err", err));
    }
  
    useEffect(()=>{
      if(lastUploadedFileIndex === null){
        return;
      }
      const isLastFile = lastUploadedFileIndex === files.length - 1;
      const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
      setCurrentFileIndex(nextFileIndex)
    },[lastUploadedFileIndex])
    useEffect(() => {
      if (files.length > 0) {
        if (currentFileIndex === null) {
          setCurrentFileIndex(
            lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
          );
        }
      }
    }, [files.length]);
  
    useEffect(() => {
      if (currentFileIndex !== null) {
        setCurrentChunkIndex(0);
      }
    }, [currentFileIndex]);
  
    useEffect(() => {
      if (currentChunkIndex !== null) {
        readAndUploadCurrentChunk();
      }
    }, [currentChunkIndex]);
  
    return (
      <Box sx={{ pt: "1em" }}>
        <Stack>
          <Button
            variant="contained"
            htmlFor="file_input_field"
            sx={{ width: "10em", mx: "auto" }}
            component="label"
          >
            Upload CSV
          </Button>
          <input
            id="file_input_field"
            type="file"
            hidden
            onChange={(e) => onUploadHandler(e.target.files)}
          />
        </Stack>
        <div
          className={`dropZone ${dropZoneActive ? "active" : ""}`}
          onDragOver={(e) => {
            setDropZoneActive(true);
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            setDropZoneActive(false);
            e.preventDefault();
          }}
          onDrop={(e) => {
            handleDrop(e);
          }}
        >
          Drop your files here
        </div>
        <div className="files">
          {
            files.map((file,fileIndex)=>{
              let progress = 0;
              if(file.finalFileName){
                progress = 100
              }else{
                const uploading = fileIndex === currentFileIndex;
                if(uploading){
                  progress = 50;
                }else{
                  progress = 0
                }
              }
              return(
                <a key={fileIndex} className="file" target="_blank"  rel="noreferrer" href={`http://localhost:5001/upload/`+file.finalFileName}>
                  <div className="name">{file.name}</div>
                <div className="progress">{progress}</div>
                </a>
              )
            })
          }
        </div>
        {/* <EnhancedTable /> */}
      </Box>
    );
  }
  
  export default FileDropZone;
  