import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import { FaFacebookF } from "@react-icons/all-files/fa/FaFacebookF.esm";
// import { SiInstagram } from "@react-icons/all-files/si/SiInstagram.esm";
// import { GoMarkGithub } from "@react-icons/all-files/go/GoMarkGithub.esm";
// import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from '@mui/material';

export default function Footer() {
    return (
        <MDBFooter bgColor='dark' className='text-center text-lg-start text-light'>
            <section className='d-flex justify-content-center justify-content-lg-between p-0 border-bottom'>
            </section>

            <section className=''>
                {/* <MDBContainer className='text-center text-md-start mt-5'>
                    <MDBRow className='mt-3'>
                        <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'> &nbsp; Contact</h6>
                            <p>
                                <MDBIcon icon="home" className="me-2" />
                                L.D. College of Engineering <br /> &nbsp;
                                Opp Gujarat University, &nbsp; <br /> &nbsp;
                                Navrangpura, Ahmedabad 380015 <br /> &nbsp;
                                GUJARAT, INDIA &nbsp;
                            </p>
                            <p>
                                <MDBIcon icon="envelope" className="me-3" />
                                ldce-abad-dte@gujarat.gov.in
                            </p>
                            <p>
                                <MDBIcon icon="phone" className="me-3" /> + 079 2630 2887
                            </p>
                        </MDBCol>

                        <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4' style={{ lineHeight: "15px" }}>
                            <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
                            <p>
                                <a href='#!' className='text-reset'>
                                    React
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Bootstarp
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Firebase
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4' style={{ lineHeight: "15px" }}>
                            <h6 className='text-uppercase fw-bold mb-4'>Recent Issues</h6>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Issue 1
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Issue 2
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Issue 3
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4' style={{ lineHeight: "15px" }}>
                            <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Pricing
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Settings
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Orders
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Help
                                </a>
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer> */}
            </section>

            <div className='text p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                {/* <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                > */}
                    {/* <Box sx={{ flexGrow: 1 }}> */}
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                                &nbsp; L.D. College of Engineering <br /> &nbsp;
                                Opp Gujarat University,
                                Navrangpura, &nbsp; <br /> &nbsp;
                                Ahmedabad 380015
                                GUJARAT, INDIA  &nbsp; <br /> &nbsp;
                                Copyright © 2023 LDCE : &nbsp;
                                <a className='text-reset fw-bold' href='http:ldce.ac.in/'>
                                    ldce.com <br />
                                </a>
                            </Grid>
                            <Grid item xs={12} sm={6} display="flex" sx={{justifyContent: {xs:"center", sm:"flex-end"}, mt:10}} >
                                <FacebookIcon /> &nbsp; &nbsp; <InstagramIcon /> &nbsp; &nbsp; <LinkedInIcon /> &nbsp; &nbsp; <GitHubIcon />
                            </Grid>
                        </Grid>
                    {/* </Box> */}
                {/* </Box> */}

            </div>
        </MDBFooter>
    )
}