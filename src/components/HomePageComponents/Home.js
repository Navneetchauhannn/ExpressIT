import React, { useState } from 'react';
import Carousel from './Carousel';
import Highlights from '../AdminPanel/Highlights';
import Media from './Media';
import Footer from './Footer';
import OurServices from './OurServices';
import ProcessFlow from './ProcessFlow';
import '../../index.css';
import BottomToTopBtn from './BottomToTopBtn';
import MagazineSlider from './MagazineSlider';
import PlacementStatistics from './PlacementStatistics';

export default function Home() {
    return (
        <>
            <Carousel />
            <BottomToTopBtn />
            <Highlights />
            <OurServices />
            <ProcessFlow />
            <Media />
            <MagazineSlider />
            <PlacementStatistics />
            {/* <Footer/> */}
        </>
    )
}