import React from "react";
import { Box, TextField, Button } from "@mui/material";

const ProjectArea = ({ projects, setProjects, selectedProject, setSelectedProject }) => {
  const [projectName, setProjectName] = React.useState("");
  const [spoUrl, setSpoUrl] = React.useState("");

  const handleRegisterProject = async () => {
    try {
      const response = await fetch("http://localhost:7071/resist_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, spo_url: spoUrl }),
      });
      const data = await response.json();
      setProjects((prevProjects) => Array.isArray(prevProjects) ? [...prevProjects, data.project_name] : [data.project_name]);
    } catch (error) {
      console.error("エラー: プロジェクト登録に失敗しました。", error);
    }
  };

  return (
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
        />
        <TextField
          label="SharePoint URL"
          value={spoUrl}
          onChange={(e) => setSpoUrl(e.target.value)}
        />
        <Button onClick={handleRegisterProject} variant="contained">
          登録
        </Button>
      </Box>
      <TextField
        select
        label="プロジェクトを選択"
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
        SelectProps={{
          native: true,
        }}
        sx={{ width: "20%" }}
      >
        <option value="" disabled>
          選択してください
        </option>
        {Array.isArray(projects) && projects.map((project, index) => (
          <option key={index} value={project}>
            {project}
          </option>
        ))}
      </TextField>
    </Box>
  );
};

export default ProjectArea;
