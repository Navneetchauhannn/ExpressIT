import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
// import sample from './REPORT.pdf'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import pdf from '../../images/Express IT Issue-2.pdf';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';


// page paper
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function PdfView() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet) {
    setPageNumber(prevPageNumber => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-2)
  }

  function changePageNext() {
    changePage(+2)
  }
  return (
    <div>
      {/* <MagazineSlider/> */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
          },
          justifyContent: "center",
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={4} sm={4}>
            {pageNumber > 1 &&
              <Button onClick={changePageBack} style={{ textDecoration: 'none' }} variant="link"><NavigateBeforeIcon />Previous</Button>
            }</Grid>
          <Grid item display='flex' justifyContent="center" xs={4}>Page {pageNumber} of {numPages}</Grid>
          <Grid display='flex' justifyContent="flex-end" item xs={4}>
            {
              pageNumber < numPages &&
              <Button onClick={changePageNext} style={{ textDecoration: 'none' }} variant="link">Next<NavigateNextIcon /></Button>
            }
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Item><Page pageNumber={pageNumber} /></Item>
            </Document>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Item><Page pageNumber={pageNumber + 1} /></Item>
            </Document>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default PdfView;
