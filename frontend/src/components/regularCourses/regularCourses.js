import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminCourses, getCourses, getRegularCourses } from '../../actions/courseActions';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Course from '../course/Course';
import RegularCourse from '../course/RegularCourse';
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const RegularCourses = () => {

  const { loading, regularCourses, error  } = useSelector(state => state.regularCourses)

  const dispatch = useDispatch();

  useEffect(() => {
    
    dispatch(getRegularCourses());

    if (error) {
        return alert.error(error)
    }

    

}, [dispatch,error])

  return (
    <div>
         <h1 id="courses_heading">Khóa học phổ biến</h1>
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
            {regularCourses?.map(course => (
                <RegularCourse key={course._id} course={course} col={3} />
            ))}
        </Carousel>

    </div>
  )
}

export default RegularCourses