import React, { SyntheticEvent, useContext } from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { ActivityList } from "./ActivityList";
import { ActivityDetails } from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import {observer} from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
  // activities: IActivity[];
  // selectActivity: (id: string) => void; //selectac is a function that returns void. we have tell iprops what kind of thing we are expecting from selectac
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (e:SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string,
}

export const ActivityDashboard: React.FC<IProps> = ({
  setEditMode,
  setSelectedActivity,
  editActivity,
  deleteActivity,
  submitting,
  target
}) => {
  const activityStore = useContext(ActivityStore);
  const {editMode, selectedActivity} = activityStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          deleteActivity={deleteActivity}
          submitting={submitting}
          target={target}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {/*only display selected activity when not in editmode */}
        {editMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}
            setEditMode={setEditMode}
            activity={selectedActivity!}
            editActivity={editActivity}
            submitting={submitting}
          />
        )}
        {/*only display form when page is in editmode*/}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
