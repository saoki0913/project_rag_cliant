import React, { useState } from "react";
import SideBar from "./components/SideBar";
import TextInput from "./components/TextInput";
import FileInput from "./components/FileInput";
import ChatArea from "./components/ChatArea";
import { Box, CircularProgress, Typography } from "@mui/material";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // アップロード中
  const [isGenerating, setIsGenerating] = useState(false); // LLM回答生成中

  const handleSendMessage = async (text) => {
    setIsGenerating(true); // 回答生成開始
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "question", content: text },
    ]);

    try {
      const response = await fetch("http://localhost:7071/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_question: text }),
      });
      const data = await response.json();
      console.log("バックエンドからの返答:", data);

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "answer", content: data.answer },
      ]);
    } catch (error) {
      console.error("エラー: チャット応答の取得に失敗しました。", error);
    } finally {
      setIsGenerating(false); // 回答生成終了
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true); // アップロード開始
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", file.type); // ファイル形式情報を追加

    try {
      const response = await fetch("http://localhost:7071/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "file", content: ` ${data.message}` },
      ]);
    } catch (error) {
      console.error("エラー: ファイルアップロードに失敗しました。", error);
    } finally {
      setIsUploading(false); // アップロード終了
    }
  };

  const handleSelectChat = (chat) => {
    console.log("選択されたチャット:", chat);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideBar chatHistory={chatHistory} onSelectChat={handleSelectChat} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
          <ChatArea messages={messages} />
        </Box>
        <Box
          sx={{
            padding: 2,
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // 中央揃え
            gap: 2, // 要素間のスペース
          }}
        >
          {isUploading && ( // アップロード中の表示
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={24} />
              <Typography>ファイルアップロード中...</Typography>
            </Box>
          )}
          {isGenerating && ( // 回答生成中の表示
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={24} />
              <Typography>回答生成中...</Typography>
            </Box>
          )}
          {!isUploading && !isGenerating && ( // 通常時の入力エリア
            <>
              <FileInput onFileUpload={handleFileUpload} />
              <TextInput onSendMessage={handleSendMessage} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default App;
