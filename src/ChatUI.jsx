import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "User", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://localhost:7071/api/function_rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      const botMessage = { sender: "Bot", text: data.answer };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  // Scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container maxWidth="sm" style={{ padding: "20px", backgroundColor: "#f0f4f8", borderRadius: "10px" }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#3f51b5" }}>
        社内用RAGチャット
      </Typography>
      <Paper
        style={{
          padding: "10px",
          maxHeight: "400px",
          overflowY: "auto",
          marginBottom: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.sender === "User" ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  padding: "10px 15px",
                  borderRadius: "15px",
                  maxWidth: "70%",
                  bgcolor: msg.sender === "User" ? "#3f51b5" : "#e0e0e0",
                  color: msg.sender === "User" ? "white" : "black",
                  alignSelf: msg.sender === "User" ? "flex-end" : "flex-start",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <ListItemText primary={msg.text} />
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>
      <Box display="flex" gap="10px">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="メッセージを入力"
          value={input}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          style={{ backgroundColor: "white", borderRadius: "5px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          style={{ padding: "10px 20px" }}
        >
          送信
        </Button>
      </Box>
    </Container>
  );
};

export default ChatUI;
