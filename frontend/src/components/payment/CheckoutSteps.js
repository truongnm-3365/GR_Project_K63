import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({ payment }) => {
    return (
        <div className="checkout-progress d-flex justify-content-center mt-5">


            {payment ? <Link to='/payment' className="float-right">
                <div className="triangle2-active"></div>
                <div className="step active-step">Thanh toán</div>
                <div className="triangle-active"></div>
            </Link> : <Link to="#!" disabled>
                    <div className="triangle2-incomplete"></div>
                    <div className="step incomplete">Thanh toán</div>
                    <div className="triangle-incomplete"></div>
                </Link>}

        </div>
    )
}

export default CheckoutSteps
