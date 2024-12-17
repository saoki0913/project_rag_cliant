import React, { useState } from "react";
import SideBar from "./components/SideBar";
import TextInput from "./components/TextInput";
import ChatArea from "./components/ChatArea";
import { Box, CircularProgress, Typography, TextField, Button } from "@mui/material";

const App = () => {
  //状態管理
  const [chatHistory, setChatHistory] = useState([]);//チャット履歴を管理
  const [messages, setMessages] = useState([]);//現在のチャットウィンドウに表示されるメッセージ
  const [isGenerating, setIsGenerating] = useState(false);//ローディング状態
  const [projects, setProjects] = useState([]);//サーバーから取得したプロジェクトのリスト
  const [isRegistering, setIsRegistering] = useState(false); // プロジェクト登録中の状態を管理
  const [selectedProject, setSelectedProject] = useState("");//ユーザーが選択したプロジェクト
  const [projectName, setProjectName] = useState("");//新しいプロジェクトを登録する際の入力フィールドの値
  const [spoUrl, setSpoUrl] = useState("");//新しいプロジェクトを登録する際の入力フィールドの値

  //サーバーからプロジェクト一覧を取得
  const fetchProjects = async () => {
    try {
      const response = await fetch("https://func-rag.azurewebsites.net/projects");
      const data = await response.json();
      // サーバーから取得したプロジェクトを安全に設定
      setProjects(
        Array.isArray(data.projects) ? data.projects.filter((p) => p && p.project_name) : []
      );
    } catch (error) {
      console.error("エラー: プロジェクト一覧の取得に失敗しました。", error);
    }
  };

  //新しいプロジェクトをサーバーに登録
  const handleRegisterProject = async (projectName, spoUrl) => {
    setIsRegistering(true); // 登録中の状態を開始
    try {
      const response = await fetch("https://func-rag.azurewebsites.net/resist_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, spo_url: spoUrl }),
      });
      const data = await response.json();
      // プロジェクトリストに新しいプロジェクトを追加
      setProjects((prevProjects) =>
        Array.isArray(prevProjects) ? [...prevProjects, data.project_name] : [data.project_name]
      );
    } catch (error) {
      console.error("エラー: プロジェクト登録に失敗しました。", error);
    } finally {
      setIsRegistering(false); // 登録中の状態を終了
    }
  };

  const handleSelectProject = (event) => {
    setSelectedProject(event.target.value);
  };

  //ユーザーが質問を送信し、サーバーから回答を取得してチャットウィンドウに表示
  const handleSendMessage = async (text) => {
    if (!selectedProject) {
      alert("プロジェクトを選択してください。");
      return;
    }

    setIsGenerating(true);
    const questionMessage = { type: "question", content: text };
    setMessages((prevMessages) => [...prevMessages, questionMessage]);

    try {
      const response = await fetch("https://func-rag.azurewebsites.net/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_question: text, project_name: selectedProject }),
      });
      const data = await response.json();
      console.log("API response:", data);
        // レスポンスから各フィールドを抽出
  const { answer, documentUrl, documentName, last_modified } = data;
        // メッセージのフォーマット
        const answerMessage = {
          type: "answer",
          content: (
            <div>
              <p>
                <strong>回答:</strong> {answer}
              </p>
              <p>
                <strong>ファイル名:</strong> {documentName}
              </p>
              <p>
                <strong>最終更新時刻:</strong> {last_modified}
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a 
                  href={documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    wordBreak: "break-all", 
                    overflowWrap: "break-word", 
                    display: "inline-block" // ブロック要素としてURLを表示
                  }}
                >
                  {documentUrl}
                </a>
              </p>
            </div>
          ),
        };
        
      

      setMessages((prevMessages) => [...prevMessages, answerMessage]);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: prevHistory.length + 1,
          title: text.slice(0, 20) || "新しい会話",
          messages: [...messages, questionMessage, answerMessage],
        },
      ]);
    } catch (error) {
      console.error("エラー: チャット応答の取得に失敗しました。", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectChat = (chat) => {
    setMessages(chat.messages);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* プロジェクト登録フォームと選択 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 2,
          gap: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="プロジェクト名"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            size="small" // 小さい入力欄
            sx={{ width: "200px", minWidth: "150px" }} // 幅を調整
          />
          <TextField
            label="SharePoint URL"
            value={spoUrl}
            onChange={(e) => setSpoUrl(e.target.value)}
            size="small" // 小さい入力欄
            sx={{ width: "200px", minWidth: "150px" }} // 幅を調整
          />
          <Button
            onClick={() => handleRegisterProject(projectName, spoUrl)}
            variant="contained"
            disabled={isRegistering} // 登録中はボタンを無効化
            size="small" // 小さくする
            sx={{ 
              minWidth: "50px", // ボタンの幅を小さく
              height: "36px",   // ボタンの高さを小さく
              padding: "4px 8px" // 内側の余白を調整
            }}
          >
            {isRegistering ? "登録中..." : "登録"}
          </Button>
        </Box>

        <TextField
          select
          label="プロジェクトを選択"
          value={selectedProject}
          onClick={fetchProjects} // プロジェクト選択欄をクリックしたときにDBからデータ取得
          onChange={handleSelectProject}
          size="small" // 小さい入力欄
          sx={{ width: "200px", minWidth: "150px" }} // 幅を調整
          SelectProps={{
            native: true,
          }}
        >
          <option value="" disabled>
          </option>
          {projects
            .filter((project) => project && project.project_name) // undefinedな要素を除外
            .map((project, index) => (
              <option key={index} value={project.project_name}>
                {project.project_name}
              </option>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
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
              alignItems: "center",
              gap: 2,
            }}
          >
            {isGenerating && (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={24} />
                <Typography>回答生成中...</Typography>
              </Box>
            )}
            {!isGenerating && (
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <TextInput onSendMessage={handleSendMessage} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
