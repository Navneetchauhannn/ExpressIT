import React, { useEffect, useState } from "react";
import img1 from '../../images/1.jpeg';
import img2 from '../../images/2.jpeg';
import img3 from '../../images/3.jpeg';
import Carousel from 'react-bootstrap/Carousel';
import '../../index.css'

function Carousell() {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <div>
            <Carousel variant="light" activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item style={{ backgroundColor: "#303a52" }}>
                    <img
                        className="d-block mypic"
                        style={{ height: 400 }}
                        src={img3}
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3> Express IT 1</h3>
                        <p>Admin and Faculty can upload the citation on behalf of the students.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={{ backgroundColor: "#303a52" }}>
                    <img
                        className="d-block mypic"
                        style={{ height: 400}}
                        src={img2}
                        alt="Second slide"
                    />

                    <Carousel.Caption>
                        <h3>Express IT 2</h3>
                        <p>Admin and Faculty can review the citations. Uploader has access to edit the citation if required</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={{ backgroundColor: "#303a52" }}>
                    <img
                        className="d-block mypic"
                        style={{ height: 400}}
                        src={img1}
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Express IT 3</h3>
                        <p>Secure authentication using Firebase. Admin and Faculty has access to upload the citations. Anyone on internet can review the citations.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
};

export default Carousell;