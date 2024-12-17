import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LanguageIcon from "@mui/icons-material/Language";

const TextInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() !== "") {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "16px",
        padding: "8px 16px",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
        backgroundColor: "#f4f4f4",
        position: "relative",
        maxWidth: "1000px", // 任意の最大幅を指定
        width: "100%",
        margin: "0 auto" // 中央寄せのために追加
      }}
    >

      {/* 入力欄 */}
      <TextField
        variant="standard"
        multiline // 複数行入力
        rows={3} // 行数を3行分
        fullWidth
        placeholder="メッセージを入力..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "transparent",
            paddingX: 1,
          },
          "& .MuiInputBase-input": {
            fontSize: "16px",
            padding: "8px 12px",
          },
          "& .MuiInput-underline:before, & .MuiInput-underline:after": {
            borderBottom: "none", // 下線を非表示
          },
          "&:hover .MuiInput-underline:before": {
            borderBottom: "none", // ホバー時も下線を非表示
          },
          "& .MuiInput-underline:hover": {
            borderBottom: "none",
          },
        }}

        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      {/* 送信ボタン */}
      <IconButton
        size="small" // ボタンの大きさを小さく
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "50%",
          padding: "8px", // 内側の余白を小さく
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
        onClick={handleSend}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default TextInput;
