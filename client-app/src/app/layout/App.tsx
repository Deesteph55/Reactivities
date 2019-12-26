import React, {
  useState,
  useEffect,
  Fragment,
  SyntheticEvent,
  useContext
} from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import {observer} from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
     null
    );
   const [editMode, setEditMode] = useState(false);
   const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState(""); //target is going to represent the button name that is being clicked

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity)
      .then(() => {
        setActivities([
          ...activities.filter(a => a.id !== activity.id),
          activity
        ]);
        //update specific activity
        //first part of array is: spread activities and filter out activity we are updating
        //so array is gonna contain activities with ids that do not match specified id of activity we are passing in
        //then we tack on newly updated activity
        setSelectedActivity(activity); //after we have created the activity we are displaying its details in the activty details component
        setEditMode(false);
      })
      .then(() => setSubmitting(false));
  };

  const handleDeleteActivity = (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name); //when you click button, set target to the name of button
    agent.Activities.delete(id)
      .then(() => {
        setActivities([...activities.filter(a => a.id !== id)]); //want to return other activities that do not match
      })
      .then(() => setSubmitting(false));
  };

  useEffect(() => {
    //gets our activities
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content="Loading activities..." />;

  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);
