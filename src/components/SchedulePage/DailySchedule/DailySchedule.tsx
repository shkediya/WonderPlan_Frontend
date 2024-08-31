import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    timelineOppositeContentClasses
} from "@mui/lab";

import AttractionsIcon from '@mui/icons-material/Attractions';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MuseumIcon from '@mui/icons-material/Museum';
import ParkIcon from '@mui/icons-material/Park';
import ActivityCard from "./ActivityCard";
import {Activity} from "../../../services/activity.service";

type DotColor = "primary" | "secondary" | "success" |
    "warning" | "inherit" | "error" | "info" | "grey" | undefined;

interface ColorSet {
    dotColor: DotColor;
    firstConnectorColor: string;
    secondConnectorColor: string;
    variant?: "outlined" | "filled";
}

const colorSets: ColorSet[] = [
    {dotColor: undefined, firstConnectorColor: 'default', secondConnectorColor: 'default'},
    {dotColor: 'primary', firstConnectorColor: 'default', secondConnectorColor: 'default'},
    {dotColor: 'primary', firstConnectorColor: 'default', secondConnectorColor: 'secondary.main', variant: 'outlined'},
    {dotColor: 'secondary', firstConnectorColor: 'secondary.main', secondConnectorColor: 'default'},
];

const timelineStyle = {
    [`& .${timelineOppositeContentClasses.root}`]: {
        flex: 0.1,
    }
};

interface ActivitiesTimelineProps {
    activities: Activity[],
    onActivityClick: (activity: Activity) => void;
}

const DailySchedule = ({activities, onActivityClick}: ActivitiesTimelineProps) => {
    return (
        <Timeline sx={timelineStyle}>
            {activities.map((activity, index) => {
                const colorSet = colorSets[index % colorSets.length];

                return (
                    <TimelineItem key={index} sx={{mb: 4}}>
                        <TimelineOppositeContent
                            sx={{m: 'auto 0'}}
                            align="right"
                            variant="body2"
                            color="text.secondary"
                        >
                            {activity.startTime}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineConnector sx={{bgcolor: colorSet.firstConnectorColor}}/>
                            <TimelineDot color={colorSet.dotColor} variant={colorSet.variant ?? 'filled'}>
                                {activity.categories && (
                                    activity.categories.includes("Museums & Theatres") ? (<MuseumIcon/>) :
                                    activity.categories.includes("Restaurants") ||
                                    activity.categories.includes("Fancy Restaurants") ||
                                    activity.categories.includes("Junk Food") ? (<FastfoodIcon/>) :
                                        activity.categories.includes("Parks") ? (<ParkIcon/>) :
                                            (<AttractionsIcon/>)
                                )}
                            </TimelineDot>
                            <TimelineConnector sx={{bgcolor: colorSet.secondConnectorColor}}/>
                        </TimelineSeparator>
                        <TimelineContent sx={{py: '12px', px: 2}}>
                            <ActivityCard activity={activity} onClick={onActivityClick}/>
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );
}

export default DailySchedule;