import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { collection, getDocs, query, orderBy} from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../index.css";
import { FaQuoteLeft } from '@react-icons/all-files/fa/FaQuoteLeft.esm'

const MagazineSlider = () => {
    const[magazineData, setMagazineData] = useState([]);
    const [state,setState]= useState(false);
    const userDataCollectionRefDocumentData = collection(db, "MagazineData");

    useEffect(()=>{
        setTimeout(()=>{
            getMagazineData();
        },2000)
    },[state])

    const getMagazineData = async() =>{
        let q;
        q = query(userDataCollectionRefDocumentData, orderBy("date", "asc"));
        const data = await getDocs(q);
        setMagazineData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        setState(true);
    }
    console.log(magazineData);

    const options = {
        responsive: {
            0: {
                items: 1,
            },
            500: {
                items: 2,
            },
            1000: {
                items: 3,
            },
        },
    };
    return (
        <div
            className="container-fluid testimonial pb-5 px-md-5"
            style={{ padding: "0 25px" }}
        >
            <h2 style={{ paddingTop: "80px" }}>
                Express IT Magazines
                <div className="line"></div>
            </h2>

            <OwlCarousel
                className="owl-theme row justify-content-center pt-5"
                // loop
                // autoplay={true}
                // autoplayTimeout={6000}
                nav
                dots={false}
                margin={9}
                {...options}
            >
                { magazineData.length !== 0  && state ?
                    magazineData.map((curdata,items)=>(
                        <div className="item" key={items}>
                        <div
                            className="card"
                            style={{ width: "100%", padding: "10px", background: "#f2f2f2", border: "0",
                            }}
                        >
                            <div className="card-body" style={{ padding: "8px 10px", height: "160px" }}>
                                <p className="card-text testimonial-card-text">
                                    <FaQuoteLeft style={{ height: "45px", width: "65px", opacity: "0.8" }} />
                                    <span style={{ paddingLeft: "10px", color: "#212529", fontSize: "18px" }}>{curdata.title}</span>
                                </p>
                            </div>
                            <div className="testimonial-card-footer" style={{ padding: "10px 0px 0px 55px" }}>
                                <p className="card-title testimonial-card-title">
                                <a target="_blank" href={curdata.fileUrl[0]}><Button style={{ backgroundColor: "#800080" }} >Download</Button></a> <br/> <br/>
                                    <p className="card-text testimonial-designation text-muted">
                                        {curdata.date}
                                    </p>
                                </p>
                            </div>
                        </div>
                    </div>
                    )) :
                    <> Loading</>
                }
            </OwlCarousel>
        </div>
    );
}

export default MagazineSlider;