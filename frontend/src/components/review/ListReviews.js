import React, { useState } from 'react'
import moment from "moment";
import 'moment/locale/vi';
import { Avatar, Button, Progress, Space  } from 'antd';


const ListReviews = ({ reviews,ratings }) => {

    const [rate, setRate] = useState(0);
 
    const ratingNumber = (num) =>{
        let count = 0
        for(let i = 0; i < reviews.length; i++){
            if(reviews[i].rating === num){
                count++
            }
        }
        return count;
    }

    return (
        <div className="reviews mt-3">
            <h3>Đánh giá: </h3>
            <div className='d-flex'>
                <div className='text-center mr-3'>
                    <h1 style={{fontSize:'90px'}}>{ratings.toFixed(1)}</h1>
                    <div style={{fontSize:'20px'}} className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(ratings / 5) * 100}%` }}></div>
                    </div>
                </div>
                <div style={{width: '100%'}}>

                    {[5,4,3,2,1].map((item) => {
                        return <div key={item} style={ratingNumber(item)/reviews.length ? {cursor:'pointer'} :{opacity:'0.5'}} className='d-flex' >
                                <Progress onClick={() => (ratingNumber(item)/reviews.length) ? setRate(item) : ""} percent={(ratingNumber(item)/reviews.length) *100} showInfo={false} strokeColor={{'0%': '#006241','100%': '#87d068',}} />       
                                <div onClick={() => (ratingNumber(item)/reviews.length) ? setRate(item) : ""} className="rating-outer">
                                    <div className="rating-inner" style={{ width: `${(item / 5) * 100}%` }}></div>
                                </div>
                                <div>
                                <div style={{width:'100px'}} className='ml-2'>
                                    {((ratingNumber(item)/reviews.length) *100).toFixed(1)}%
                                    {rate === item && <Button onClick={() => setRate(0)} className='ml-1' shape="circle" size='small'>X</Button>}
                                </div>
                                
                            </div>
                    </div>

                    })}


                </div>
            </div>
            <hr />
            {reviews && reviews.filter(item => rate !== 0 ? item.rating === rate : item).map(review => (
                <div key={review._id} className="review-card my-3">
                    <Space style={{alignItems:'flex-start'}}>
                        <Avatar size={'large'} src={process.env.REACT_APP_API_URL + review?.avatar}></Avatar>
                        <div>
                            <div className='font-weight-bold'>{review.name}</div>
                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(review.rating / 5) * 100}%` }}></div>
                            </div>
                            <p className="review_comment">{review.comment}</p>
                            <p className="review_user">Được đánh giá từ {moment(review.createdAt).locale('vi').fromNow()}</p>
                            
                        </div>
                    </Space>
                    


                    <hr />
                </div>
            ))}
        </div>
    )
}

export default ListReviews
