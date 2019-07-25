import React, { useEffect } from 'react';
import { Button } from 'antd';
import '../../scss/app.scss';

const ScrollToTop = (props) => {

  useEffect(() => {
    const el = props.getCurrentRef();
    document.getElementById('scroll-top-button').style.transform = "translateX(70px) rotate(180deg)";
    el.addEventListener('scroll', handleScroll);
    if (/Edge/.test(navigator.userAgent)) {
      document.getElementById('scroll-top-button').style.display = 'none';
    }
  }, [props])

  const handleScroll = (e) => {
    const el = props.getCurrentRef();
    if (!!el) {
      if (el.scrollTop <= 30) {
        document.getElementById('scroll-top-button').style.transform = "translateX(70px) rotate(180deg)";
      }
      else {
        document.getElementById('scroll-top-button').style.transform = "translateX(0) rotate(0deg)";
      }
    }
  }

  const handleClick = () => {
    const el = props.getCurrentRef();
    el.style.scrollBehavior = "smooth";
    setTimeout(() => {
      el.scrollTo(0, 0);
      el.style.scrollBehavior = "auto";
    }, 10);
  }

  return <Button size={"large"} icon="up" type="primary" shape={"round"} onClick={handleClick} id="scroll-top-button" />
}

export default ScrollToTop;