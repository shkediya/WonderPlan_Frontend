import {Coordinates} from "../../services/google-maps.service";
import {Box, Button, Card, CardContent, CardMedia, Chip, Rating, Typography} from "@mui/material";

export interface Place {
    name: string;
    description?: string;
    categories?: string[];
    address?: string;
    coordinates?: Coordinates;
    cost?: number;
    rating?: number;
    priceLevel?: number;
    imageUrl?: string
}

interface PlaceDetailsProps {
    place: Place;
    onAddClick: () => void;
}

type ChipColor = "primary" | "default" | "info" | "warning" | "error"
    | "secondary" | "success" | undefined;

const PriceLevel = ['Free', 'Inexpensive', 'Moderate Price', 'Expensive', 'Very Expensive'];
const PriceLevelColor = ['primary', 'default', 'info', 'warning', 'error'];

const PlaceDetails = ({place, onAddClick}: PlaceDetailsProps) => {
    return (
        <Card sx={{boxShadow: 'none', minWidth: '250px', maxWidth: '280px'}}>
            {place.imageUrl && (
                <CardMedia
                    component="img"
                    image={place.imageUrl}
                    alt={place.name}
                    style={{height: 100}}
                />
            )}
            <CardContent
                sx={{display: 'flex', flexDirection: 'column', paddingTop: 2, paddingRight: 1, paddingLeft: 1}}>
                <Box display='flex' flexDirection='column' gap={2}>
                    <Box display='flex' flexDirection='column' gap={1}>
                        <Box display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                            <Typography sx={{fontSize: '18px'}}>
                                {place.name}
                            </Typography>
                            {place.priceLevel !== undefined && (
                                <Chip
                                    key="type"
                                    label={PriceLevel[place.priceLevel]}
                                    color={PriceLevelColor[place.priceLevel] as ChipColor}
                                    sx={{color: 'white'}}
                                />
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {place.address}
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Rating value={place.rating ? Math.floor(place.rating) : 0} readOnly size="small" precision={0.1} />
                            <Typography variant="body2" color="text.secondary" ml={1}>
                                ({place.rating ? place.rating.toFixed(1) : 0})
                            </Typography>
                        </Box>
                    </Box>
                    <Button variant="outlined" sx={{width: '70%'}} onClick={onAddClick}>
                        Add To Schedule
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
};

export default PlaceDetails;

