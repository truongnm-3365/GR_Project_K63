import React, { Fragment, useEffect } from 'react'

import MetaData from '../../components/layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors } from '../../actions/orderActions'

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'

import axios from 'axios'
import { newRegisterCourse,extendCourse } from '../../actions/registerCourseAction'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

const options = {
    style: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: '#9e2146'
        }
    }
}

const useQuery = () => {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Payment = ({ history,match }) => {

    const alert = useAlert();
    const stripe = useStripe();
    const query = useQuery();
    const elements = useElements();
    const dispatch = useDispatch();
    const courseId = match.params.courseId
    const amount = match.params.amount

    const { user } = useSelector(state => state.auth)
    const { error } = useSelector(state => state.newOrder)

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

    }, [dispatch, alert, error])


    const createdAt = query.get("createdAt") || ""
    

    const paymentData = {
        amount:amount*100 === 0 ? 100 : amount*100
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        document.querySelector('#pay_btn').disabled = true;

        let res;
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            res = await axios.post('/api/v1/payment/process', paymentData, config)

            const clientSecret = res.data.client_secret;

            console.log(clientSecret);

            if (!stripe || !elements) {
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

            if (result.error) {
                alert.error(result.error.message);
                document.querySelector('#pay_btn').disabled = false;
            } else {

                // The payment is processed or not
                if (result.paymentIntent.status === 'succeeded') {
                    if(createdAt){
                        dispatch(extendCourse({createdAt}))
                    }else{
                        dispatch(newRegisterCourse(courseId))
                    }
                     
                    history.push(`/success/${courseId}`)
                } else {
                    alert.error('Có một số vấn đề trong khi xử lý thanh toán')
                }
            }


        } catch (error) {
            document.querySelector('#pay_btn').disabled = false;
            alert.error(error.response.data.message)
        }
    }

    return (
        <Fragment>
            <MetaData title={'Thanh toán'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Thông tin thẻ</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Số thẻ</label>
                            <CardNumberElement
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_exp_field">Thời hạn thẻ</label>
                            <CardExpiryElement
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_cvc_field">CVC</label>
                            <CardCvcElement
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                options={options}
                            />
                        </div>


                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            Thanh toán {` - ${amount}`}
                        </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Payment
