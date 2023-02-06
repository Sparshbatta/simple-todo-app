import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { useState, useEffect } from 'react';
import './index.css';
import Auth from './components/Auth';
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies?.Email;
  const authToken = cookies?.AuthToken;
  const [tasks, setTasks] = useState(null);
  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(authToken){
      getData();
    }
  }, []);

  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date));


  return (
    <div className="app">
      {(authToken === undefined) ? <Auth /> : (
        <>
          <ListHeader listName={'🛒 Shopping Mart List'} getData={getData} />
          <p className="user-email">Welcome back {userEmail}</p>
          {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
        </>
      )}
      <p className="copyright">Copyright © 2023 TODOS APP - All rights reserved.</p>
    </div>
  );
}

export default App;