import React, { useState } from "react";
import {Box,  Drawer, List, ListItem, ListItemText, Typography, Divider, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const SideBar = ({ chatHistory, onSelectChat }) => {
  const [open, setOpen] = useState(false); // サイドバーの表示・非表示を管理

  const toggleDrawer = (isOpen) => {
    setOpen(isOpen);
  };

  return (
    <div>
      {/* サイドバーが閉じているときのみメニューボタンを表示 */}
      {!open && (
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => toggleDrawer(true)}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }} // メニューボタンの位置を固定
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* サイドバー */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => toggleDrawer(false)}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // スマホなどで開閉がスムーズになるように
        }}
      >
        <Box sx={{ width: 240 }}>
          <Typography variant="h6" sx={{ padding: "16px" }}>
            チャット履歴
          </Typography>
          <Divider />
          <List>
            {chatHistory.map((chat, index) => (
              <ListItem button key={index} onClick={() => onSelectChat(chat)}>
                <ListItemText primary={chat.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default SideBar;
