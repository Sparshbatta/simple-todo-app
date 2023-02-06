import React, {useState} from 'react'
import { useCookies } from 'react-cookie';

const Modal = ({mode, setShowModal, task, getData}) => {

  const [cookies, setCookie, removeCookie] = useCookies(null);
  const isEditMode = mode === 'edit' ? true : false;

  const [data, setData] = useState({
    user_email : isEditMode ? task.user_email : cookies.Email,
    title : isEditMode ? task.title : "",
    progress : isEditMode ? task.progress : 50,
    date : isEditMode ? task.date : new Date()
  });

  //create new todo
  const postData = async (e) => {
    try{
      e.preventDefault();
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/create`,{
        method: "POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      });
      if(response.status === 201){
        setShowModal(false);
        getData();
      }
    }catch(err){
      console.log(err.message);
    }
  }

  //edit a todo
  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
      });
      if(response.status === 200){
        setShowModal(false);
        getData();
      }
    }catch(err){
      console.log(err.message);
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData(data=>({
      ...data,
      [name]:value
    }));
    console.log(data);
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task!</h3>
          <button onClick={()=>{setShowModal(false)}}>X</button>
        </div>
        <form>
          <input required maxLength={30} placeholder="Title of your task" name="title" value={data.title} onChange={handleChange}/>
          <br/>
          <label htmlFor="range">Drag to select your current progress</label>
          <input required type="range" id="range" min="0" max="100" name="progress" value={data.progress} onChange={handleChange}/>
          <input className={mode} type="submit" onClick={isEditMode ? editData : postData}/>
        </form>
      </div>
    </div>
  )
}

export default Modal