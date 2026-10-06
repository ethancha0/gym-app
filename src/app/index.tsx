import { Redirect } from 'expo-router';

// The app launches at "/", but the tabs live at /today, /routines, ...
// Every URL needs a matching file, so this one forwards "/" to the Today tab.
export default function Index() {
  return <Redirect href="/today" />;
}
