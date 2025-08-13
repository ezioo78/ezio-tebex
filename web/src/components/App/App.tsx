import React, {useEffect, useState} from 'react';
import './App.css'
import {debugData} from "../../utils/debugData";
import {fetchNui} from "../../utils/fetchNui";
import Home from '../../pages/Home/Home';
import { useRoutes } from 'react-router-dom';
import { routes } from '../../routes';


const App: React.FC = () => {

  return useRoutes(routes);
}

export default App;
