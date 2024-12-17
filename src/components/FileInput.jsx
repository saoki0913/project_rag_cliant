import React from "react";
import { Box, Button } from "@mui/material";

const FileInput = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file); // ファイルを親に渡す
    }
  };

  return (
    <Box>
      <Button variant="outlined" component="label">
        ファイルを選択
        <input
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
};

export default FileInput;
