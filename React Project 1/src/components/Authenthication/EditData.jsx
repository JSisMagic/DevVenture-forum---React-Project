import React from 'react';
import { db } from '../../services/database-services';
import { auth } from '../../config/firebase-config';



const editData=async(e)=>{
  e.preventDefault();
  const user = auth.currentUser;
}