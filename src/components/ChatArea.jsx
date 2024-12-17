import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ChatArea = ({ messages }) => {
  return (
    <Box sx={{ padding: "16px", overflowY: "auto", height: "100%" }}>
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: message.type === "answer" ? "flex-start" : "flex-end",
            marginBottom: "8px",
          }}
        >
          <Paper
            sx={{
              padding: "10px 15px",
              borderRadius: "15px",
              maxWidth: "70%",
              backgroundColor: message.type === "answer" ? "#e1f5fe" : "#f1f1f1",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: message.type === "answer" ? "text.primary" : "text.secondary",
                fontWeight: message.type === "answer" ? "bold" : "normal",
              }}
            >
              {message.content}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default ChatArea;
