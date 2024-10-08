import React, {useState} from "react";
import {
    Box,
    TextField,
    Button,
    Grid,
    Autocomplete,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormHeader from "../Forms/FormHeader";
import {LocalizationProvider, DatePicker} from "@mui/x-date-pickers";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useNavigate} from "react-router-dom";
import {useTrips} from "../../contexts/TripProvider";
import "../../styles/Forms.css";
import tripService from "../../services/trip.service";
import userService, {User} from "../../services/user.service";
import dayjs from "dayjs";
import axios from "axios";

const CreateTripForm: React.FC = () => {
  const { fetchUserTrips } = useTrips();
  const [currentDestination, setCurrentDestination] = useState("");
  const [currentParticipant, setCurrentParticipant] = useState("");
  const [trip, setTrip] = useState({
    startDate: new Date(),
    endDate: new Date(),
    destinations: [] as string[],
    participants: [] as string[],
    ownerId:
      JSON.parse(localStorage.getItem("currentUser") || "{}")?.userId || "",
    isPublic: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [userNotFoundError, setUserNotFoundError] = useState<string | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchSuggestions = async (input: string) => {
    console.log('Fetching suggestions for:', input);
    try {
      const response = await axios.get('http://localhost:3000/api/location/autocomplete', {
        params: { input },
      });
      console.log('API response:', response.data);
      setSuggestions(response.data.map((item: any) => item.description));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = async (_event: any, newInputValue: string) => {
    setCurrentDestination(newInputValue);

    if (newInputValue) {
      await fetchSuggestions(newInputValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleDateChange = (date: Date | null, name: string) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: date,
    }));
  };

    const updateParticipants = async (
        _event: unknown,
        newParticipants: string[]
    ) => {
        setUserNotFoundError(null);

        const lastParticipantEmail = newParticipants[newParticipants.length - 1];

        try {
            await fetchParticipantByEmail(lastParticipantEmail);

            setCurrentParticipant(lastParticipantEmail);
            setTrip((trip) => ({
                ...trip,
                participants: newParticipants,
            }));
        } catch (error) {
            setUserNotFoundError((error as Error).message);
        }
    };

    const fetchParticipantByEmail = async (email: string): Promise<User> => {
        try {
            return (await userService.getByEmail(email)) as User;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    };

    const updateDestinations = (_event: unknown, newVal: string[]) => {
        setTrip((prevTrip) => ({
            ...prevTrip,
            destinations: newVal,
        }));
    };

    const handlePublicChange = (event: SelectChangeEvent) => {
        setTrip((prevTrip) => ({
            ...prevTrip,
            isPublic: event.target.value === "true",
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trip.startDate || !trip.endDate) {
            setError("Start date and end date must be chosen.");
            return;
        }
        if (trip.startDate > trip.endDate) {
            setError("Start date cannot be after the end date.");
            return;
        }
        if (!trip.participants || !trip.destinations) {
            setError("Invalid trip data.");
            return;
        }

        setError(null);

        try {
            const updatedDestinations = [...trip.destinations];

            if (
                currentDestination &&
                !updatedDestinations.includes(currentDestination)
            ) {
                updatedDestinations.push(currentDestination);
            }

            const updatedParticipants = [...trip.participants];
            if (
                currentParticipant &&
                !updatedParticipants.includes(currentParticipant)
            ) {
                updatedParticipants.push(currentParticipant);
            }

            const cleanedTrip = {
                ...trip,
                participants: updatedParticipants.map((participant: string) =>
                    participant ? participant.trim() : ""
                ),
                destinations: updatedDestinations.map((destination: string) =>
                    destination ? destination.trim() : ""
                ),
            };

            await tripService.createTrip(cleanedTrip);
            toast.success("Trip created successfully");
            fetchUserTrips();
            navigate("/trips");
        } catch (error) {
            toast.error("Failed to create trip");
            console.error("Failed to save trip:", error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="form-main-container">
                <FormHeader
                    mainTitle="Create Trip"
                    secondaryTitle="Enter your next journey details"
                />
                <Grid
                    container
                    spacing={2}
                    component="form"
                    onSubmit={handleSave}
                    sx={{width: "100%"}}
                >
                    <Grid item xs={6}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Start Date"
                                format="DD/MM/YYYY"
                                value={dayjs(trip.startDate)}
                                onChange={(date) => handleDateChange("startDate", date!.toDate())}
                            />
                        </DemoContainer>
                    </Grid>
                    <Grid item xs={6}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="End Date"
                                format="DD/MM/YYYY"
                                value={dayjs(trip.endDate)}
                                onChange={(date) => handleDateChange("endDate", date!.toDate())}
                            />
                        </DemoContainer>
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            multiple
                            id="tags-filled"
                            freeSolo
                            onChange={updateDestinations}
                            onInputChange={handleInputChange}
                            options={suggestions}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Destinations"
                                    placeholder="Destinations"
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            minHeight: 56
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="public-select-label">Access Mode</InputLabel>
                            <Select
                                labelId="public-select-label"
                                id="public-select"
                                value={trip.isPublic.toString()}
                                label="Access Mode"
                                onChange={handlePublicChange}
                                variant="outlined">
                                <MenuItem value="true">public</MenuItem>
                                <MenuItem value="false">private</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            id="tags-filled"
                            freeSolo
                            value={trip.participants}
                            onChange={updateParticipants}
                            onInputChange={() => setUserNotFoundError(null)}
                            options={[]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Participants"
                                    placeholder="Participants"
                                    error={!!userNotFoundError}
                                    helperText={userNotFoundError}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            minHeight: 56
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Create Trip
                        </Button>
                    </Grid>
                    {error && (
                        <Grid item xs={12}>
                            <Typography color="error">{error}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </LocalizationProvider>
    );
};

export default CreateTripForm;
