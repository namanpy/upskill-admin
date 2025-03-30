import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "primary.main",
        }}
      >
        Dashboard
      </Typography>

      {/* Student Data Section */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mt: 3, fontWeight: 500 }}
      >
        Student Data
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ flexWrap: "wrap" }}
      >
        {[
          { value: 6, label: "Total Student" },
          { value: 0, label: "Plan Purchased Student" },
          { value: 0, label: "Today's Register Student" },
          { value: 1, label: "Total Teacher" },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{ minWidth: { xs: "100%", sm: "45%", md: "22%" } }}
          >
            <Card
              sx={{
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ position: "relative" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.9rem",
                    mt: 1,
                  }}
                >
                  {item.label}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    color: "primary.main",
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Homework Data Section */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        Home Work Data
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ flexWrap: "wrap" }}
      >
        {[
          { value: 2, label: "To: Homework Assign" },
          { value: 0, label: "To Do" },
          { value: 0, label: "Not Checked" },
          { value: 2, label: "Checked" },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{ minWidth: { xs: "100%", sm: "45%", md: "22%" } }}
          >
            <Card
              sx={{
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ position: "relative" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: "secondary.main",
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.9rem",
                    mt: 1,
                  }}
                >
                  {item.label}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    color: "primary.main",
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Doubt Data Section */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        Doubt Data
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ flexWrap: "wrap" }}
      >
        {[
          { value: 12, label: "Total Doubts" },
          { value: 6, label: "Not Answered" },
          { value: 6, label: "Answered" },
          { value: 0, label: "Today's Doubts" },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{ minWidth: { xs: "100%", sm: "45%", md: "22%" } }}
          >
            <Card
              sx={{
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ position: "relative" }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: "info.main",
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.9rem",
                    mt: 1,
                  }}
                >
                  {item.label}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    color: "primary.main",
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Dashboard;
