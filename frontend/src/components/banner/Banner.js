import { useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../../actions/bannerAction";

import './index.css'

const Banner = () => {
    const { banners } = useSelector(state => state.banners)
    const dispatch = useDispatch();
    useEffect(() => {
        
        dispatch(getBanners());

    }, [dispatch])

  return (
    <>
        <div className="">
            <Carousel >
                {banners && banners.map(banner => (
                    <Carousel.Item key={banner._id}>
                        <img className="banner" src={banner.images[0].url} />
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>

    </>
  )
}

export default Banner