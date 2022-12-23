import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from './Tables/StudentTable';
import Faculty from './Tables/FacultyTable';
import Department from './Tables/DepartmentTable';

import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const userDataCollectionRefDocumentData = collection(db, "DocumentData");
  const [documentData, setDocumentData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getDocumentData = async () => {
    let q;
    q = query(userDataCollectionRefDocumentData, orderBy("date", "desc"));
    const data = await getDocs(q);
    setDocumentData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    getDocumentData();
    
  }, [])
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs indicatorColor="secondary" textColor='secondary' value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Student" {...a11yProps(0)} />
          <Tab label="Faculty" {...a11yProps(1)} />
          <Tab label="Department" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Table documentData={documentData}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Faculty  documentData={documentData}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Department documentData={documentData}/>
      </TabPanel>
    </Box>
  );
}