import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { supabase } from './CreateClient';

const App = () => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', type: 'number', width: 100,},
    {field: "update",headerName: "Update" ,width: 150, renderCell: (params) => (
      <>
        <button onClick={() => displayUser(params.row.id)}>Update</button>
      </>
    )},
    {field: "delete",headerName: "Delete" ,width: 150, renderCell: (params) => (
      <>
        <button onClick={() => deleteUser(params.row.id)}>delete</button>
      </>
    )}
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState( {name : "" , age : "" } )
  const [user2, setUser2] = useState( {id: null,name : "" , age : "" } )
  const [loading, setLoading] = useState(true);

  const handleChange = async (e) => {
    setUser(prevFormData => {
      return {...prevFormData , [e.target.name] : e.target.value}
    })
  }
  const handleChange2 = async (e) => {
    setUser2(prevFormData => {
      return {...prevFormData , [e.target.name] : e.target.value}
    })
  }

const addUser = async (e) => {
  e.preventDefault();
   await supabase.from("users").insert([{ name: user.name, age: Number(user.age) }]);
  setUser({ name: "", age: "" });
  fetchUsers();
};

const updateUser = async (e) => {
  e.preventDefault();

  const { error } = await supabase
    .from("users")
    .update({
      name: user2.name,
      age: Number(user2.age)
    })
    .eq("id", user2.id);

  if (error) {
    console.log(error);
    return;
  }

  setUser2({ id: null, name: "", age: "" });
  fetchUsers();
};

const deleteUser = async (userId) => {
  const {data,error} = await supabase.from("users").delete().eq("id",userId)
  fetchUsers()
  if (error) {
    console.log(error)
  } 
}

const displayUser = (userId) => {
  const selectedUser = users.find(user => user.id === userId);
  users.map((user) => {
    if(user.id === userId) {
      setUser2({id: selectedUser.id,name:user.name,age:user.age})
    }
  })
}

  const fetchUsers = async () => {
    const {data} = await supabase.from('users').select('*')
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Paper sx={{ height: 400, width: { xs: '95%', sm: '90%', md: '70%' }, mx: 'auto', my: 5, p: 2, borderRadius: 3, border: '1px solid #e0e0e0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',  }}>
      <DataGrid sx={{ marginBottom: 5}} rows={users} columns={columns} loading={loading} initialState={{ pagination: { paginationModel } }} pageSizeOptions={[5, 10]} />
      <nav>
        <form onSubmit={addUser}>
          <div className="input-wrapper">
            <input value={user.name} type="text" placeholder="name" name="name" class="input" onChange={handleChange}/>
          </div>
          <div className="input-wrapper">
            <input value={user.age} type="number" placeholder="age" name="age" class="input" onChange={handleChange}/>
          </div>
          <button class="vista-button" type='submit'>ADD</button>
        </form>    
        <form onSubmit={updateUser}>
          <div className="input-wrapper">
            <input value={user2.name} type="text" placeholder="" name="name" class="input" onChange={handleChange2}/>
          </div>
          <div className="input-wrapper">
            <input value={user2.age} type="number" placeholder="" name="age" class="input" onChange={handleChange2}/>
          </div>
          <button class="vista-button" type='submit'>Save changes</button>
        </form>    
      </nav>
    </Paper>
  );
};

export default App;

