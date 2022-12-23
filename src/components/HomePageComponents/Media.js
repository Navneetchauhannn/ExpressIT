import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
const theme = createTheme();

export default function Media() {
  const navigate = useNavigate();
    return(
        <>
        <ThemeProvider theme={theme}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Express IT
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              "Don&apos;t let Anyone steal your dream, It&apos;s your dream, not theirs.!"
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" style={{backgroundColor:"purple"}} onClick={()=>{navigate('/contact')}}>Connect With Us</Button>
              <Button variant="outlined" style={{color:'purple', borderColor:"purple"}} onClick={()=>{navigate('/addactivity')}} >Add Achievement</Button>
            </Stack>
          </Container>
        </Box>
        </ThemeProvider>
        </>
    )
}