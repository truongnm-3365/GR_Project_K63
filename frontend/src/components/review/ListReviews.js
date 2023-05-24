import React from 'react'

const ListReviews = ({ reviews }) => {
    return (
        <div className="reviews">
            <h3>Đánh giá:</h3>
            <hr />
            {reviews && reviews.map(review => (
                <div key={review._id} className="review-card my-3">
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(review.rating / 5) * 100}%` }}></div>
                    </div>
                    <p className="review_user">Được đánh giá bởi <span className='font-weight-bold'>{review.name}</span></p>
                    <p className="review_comment">{review.comment}</p>

                    <hr />
                </div>
            ))}
        </div>
    )
}

export default ListReviews
