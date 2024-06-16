import { Box, Typography, ButtonGroup, Button } from "@mui/material";
import { Link } from "react-router-dom";

export interface NavbarProps {
  showButtonGroup: boolean;
}

const isUserLoggedIn = () => {
  return localStorage.getItem('currentUser') !== null;
}
const Navbar = ({ showButtonGroup }: NavbarProps) => {
  return (
    <Box sx={{ padding: "1rem", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h5" component="a" href="" sx={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }}>WonderPlan</Typography>
      {showButtonGroup && (
        <ButtonGroup variant="text" aria-label="Basic button group">
          {isUserLoggedIn() && (
            <Button component={Link} to="/createTrip">
              Create Trip
            </Button>
          )}
          <Button component={Link} to="/addActivities">
            Add Activities
          </Button>
          <Button component={Link} to="/community">
            Community Trips
          </Button>
          {!isUserLoggedIn() && (
            <Button component={Link} to="/signin">
              Login
            </Button>
          )}
          {!isUserLoggedIn() && (
            <Button component={Link} to="/register">
              Sign Up
            </Button>
          )}
          <Button component={Link} to="/trip">
            Trip Details
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default Navbar;

