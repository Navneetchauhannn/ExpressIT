import React, {useState} from 'react'

const BottomToTopBtn = () => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300){
          setVisible(true)
        } 
        else if (scrolled <= 300){
          setVisible(false)
        }
      };

    const scrollTopTop = () => {
        window.scrollTo(0, 0)
    }
    window.addEventListener('scroll', toggleVisible);
    return (
        <button className='bottomToTopBtn' id='bottomToTopBtn' onClick={scrollTopTop} style={{ position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '40px', fontSize: '20px', display: visible ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: '99' }}>
            ↑
        </button>
    )
}

export default BottomToTopBtn;
