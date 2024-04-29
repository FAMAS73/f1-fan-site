import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import { db } from "@/utils/firebaseConfig"; // Adjust this path as needed
import {
  collection,
  doc,
  getDocs,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListItemText,
} from "@mui/material";

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({
    name: "",
    base: "",
    team_principal: "",
    image_url: "",
  });
  const [currentDriver, setCurrentDriver] = useState({
    name: "",
    bio: "",
    image_url: "",
    team_id: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "teams"));
    const teamsData = [];
    for (const doc of querySnapshot.docs) {
      const teamData = {
        id: doc.id,
        ...doc.data(),
        drivers: [],
      };
      const driversSnapshot = await getDocs(
        collection(db, "teams", doc.id, "drivers")
      );
      teamData.drivers = driversSnapshot.docs.map((driverDoc) => ({
        id: driverDoc.id,
        ...driverDoc.data(),
      }));
      teamsData.push(teamData);
    }
    setTeams(teamsData);
    setLoading(false);
  };

  const handleOpenTeamDialog = (team = null) => {
    setCurrentTeam(
      team || { name: "", base: "", team_principal: "", image_url: "" }
    );
    setOpenTeamDialog(true);
    setIsEditMode(!!team);
  };

  const handleOpenDriverDialog = (driver = null, teamId = "") => {
    setCurrentDriver(
      driver || { name: "", bio: "", image_url: "", team_id: teamId }
    );
    setOpenDriverDialog(true);
    setIsEditMode(!!driver);
  };

  const handleCloseDialog = () => {
    setOpenTeamDialog(false);
    setOpenDriverDialog(false);
    setIsEditMode(false);
  };

  const handleSubmitTeam = async () => {
    const teamRef = isEditMode
      ? doc(db, "teams", currentTeam.id)
      : collection(db, "teams");
    isEditMode
      ? await updateDoc(teamRef, currentTeam)
      : await addDoc(teamRef, currentTeam);
    fetchTeams();
    handleCloseDialog();
  };

  const handleSubmitDriver = async () => {
    const driverRef = isEditMode
      ? doc(db, "teams", currentDriver.team_id, "drivers", currentDriver.id)
      : collection(db, "teams", currentDriver.team_id, "drivers");
    isEditMode
      ? await updateDoc(driverRef, currentDriver)
      : await addDoc(driverRef, currentDriver);
    fetchTeams();
    handleCloseDialog();
  };

  const handleDelete = async (type, id, teamId = null) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      const ref =
        type === "team"
          ? doc(db, "teams", id)
          : doc(db, "teams", teamId, "drivers", id);
      await deleteDoc(ref);
      fetchTeams();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard - Teams and Drivers
      </Typography>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
      <Button variant="outlined" onClick={() => handleOpenTeamDialog()}>
        Add New Team
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleOpenDriverDialog(null, "")}
      >
        Add New Driver
      </Button>
      {teams.map((team) => (
        <Card key={team.id} sx={{ mb: 2 }}>
          <CardMedia
            component="img"
            height="140"
            image={team.image_url || "/default-team.jpg"}
            alt={team.name}
          />
          <CardContent>
            <Typography variant="h5">{team.name}</Typography>
            <Typography>{team.base}</Typography>
            <Button onClick={() => handleOpenTeamDialog(team)}>
              Edit Team
            </Button>
            <Button onClick={() => handleDelete("team", team.id)}>
              Delete Team
            </Button>
            <Typography variant="subtitle1">Drivers:</Typography>
            {team.drivers.map((driver) => (
              <ListItem key={driver.id}>
                <ListItemAvatar>
                  <Avatar
                    src={driver.image_url || "/default-driver.jpg"}
                    alt={driver.name}
                  />{" "}
                  // Fallback to a default image
                </ListItemAvatar>
                <ListItemText primary={driver.name} secondary={driver.bio} />
                <Button onClick={() => handleOpenDriverDialog(driver, team.id)}>
                  Edit Driver
                </Button>
                <Button
                  onClick={() => handleDelete("driver", driver.id, team.id)}
                >
                  Delete Driver
                </Button>
              </ListItem>
            ))}
            <Button onClick={() => handleOpenDriverDialog(null, team.id)}>
              Add Driver to This Team
            </Button>
          </CardContent>
        </Card>
      ))}
      <Dialog open={openTeamDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? "Edit Team" : "Add New Team"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={currentTeam.name}
            onChange={(e) =>
              setCurrentTeam({ ...currentTeam, name: e.target.value })
            }
          />
          <TextField
            label="Base"
            fullWidth
            margin="dense"
            value={currentTeam.base}
            onChange={(e) =>
              setCurrentTeam({ ...currentTeam, base: e.target.value })
            }
          />
          <TextField
            label="Team Principal"
            fullWidth
            margin="dense"
            value={currentTeam.team_principal}
            onChange={(e) =>
              setCurrentTeam({ ...currentTeam, team_principal: e.target.value })
            }
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="dense"
            value={currentTeam.image_url}
            onChange={(e) =>
              setCurrentTeam({ ...currentTeam, image_url: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitTeam}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDriverDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {isEditMode ? "Edit Driver" : "Add New Driver"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={currentDriver.name}
            onChange={(e) =>
              setCurrentDriver({ ...currentDriver, name: e.target.value })
            }
          />
          <TextField
            label="Bio"
            fullWidth
            margin="dense"
            value={currentDriver.bio}
            onChange={(e) =>
              setCurrentDriver({ ...currentDriver, bio: e.target.value })
            }
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="dense"
            value={currentDriver.image_url}
            onChange={(e) =>
              setCurrentDriver({ ...currentDriver, image_url: e.target.value })
            }
          />
          <FormControl fullWidth>
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              value={currentDriver.team_id}
              label="Team"
              onChange={(e) =>
                setCurrentDriver({ ...currentDriver, team_id: e.target.value })
              }
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitDriver}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
