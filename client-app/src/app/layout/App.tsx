import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]); //this an activities array. use spread operator to take existing activities and spread the
      //into new array and add new activity onto array
      setSelectedActivity(activity); //after we have created the activity we are displaying its details in the activty details component
      setEditMode(false);
    });
  };

  const handleEditActivity = (activity: IActivity) => {
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    //update specific activity
    //first part of array is: spread activities and filter out activity we are updating
    //so array is gonna contain activities with ids that do not match specified id of activity we are passing in
    //then we tack on newly updated activity
    setSelectedActivity(activity); //after we have created the activity we are displaying its details in the activty details component
    setEditMode(false);
    }) 
  }

  const handleDeleteActivity = (id: string) => {
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]); //want to return other activities that do not match
    })
  };

  useEffect(() => {
    //gets our activities
    agent.Activities.list().then(response => {
      let activities: IActivity[] = [];
      response.forEach((activity) => {
        activity.date = activity.date.split(".")[0];
        activities.push(activity);
      });
      setActivities(activities);
    }).then(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent content='Loading activities...'/> 

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
