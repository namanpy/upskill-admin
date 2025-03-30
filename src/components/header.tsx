import { useContext } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../context/theme.context";

const Header = ({ username }: { username: string }) => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const isDarkMode = document.body.classList.contains("dark");

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Left Side: App Name */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            letterSpacing: 1,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          UpskillLab
        </Typography>

        {/* Right Side: Username and Theme Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: 1,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            {username}
          </Typography>
          <IconButton
            onClick={toggleColorMode}
            color="inherit"
            sx={{
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
