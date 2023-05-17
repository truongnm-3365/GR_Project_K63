import React, { Fragment, useEffect, useState } from 'react'

import MetaData from '../../components/layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors } from '../../actions/orderActions'

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'

import axios from '../../axios/axios'
import { newRegisterCourse,extendCourse } from '../../actions/registerCourseAction'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { spendConsumPoint } from '../../actions/userActions'


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
    //let amount = match.params.amount

    const { user } = useSelector(state => state.auth)
    const { error } = useSelector(state => state.newOrder)

    const [point,setPoint] = useState(0);
    const [amount,setMount] = useState(match.params.amount)

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

    }, [dispatch, alert, error,amount])


    const createdAt = query.get("createdAt") || ""
    

    const usePoint = (e) =>{
        e.preventDefault();
        if(user.consumPoint < point){
            alert.error("Bạn không đủ điểm tiêu dùng để sử dụng")
        }else{
            setMount(match.params.amount - match.params.amount*(point/100))
        }
        
    }





    const submitHandler = async (e) => {
        e.preventDefault();

        const paymentData = {
            amount:amount*100 === 0 ? 100 : amount*100
        }

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
                    dispatch(spendConsumPoint(point))
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

            <div className="row wrapper mt-0">
                <div className="col-10 col-lg-5">
                    <div className="form-group">
                    <form onSubmit={usePoint}>
                        <label htmlFor="card_num_field">Điểm tiêu dùng</label>
                            <div className='d-flex'>
                            <input placeholder='Sử dụng điểm sẽ giảm giá lên tới 20%' onChange={(e) => setPoint(e.target.value)} className='form-control col-8' min="0" max="20" type='number'></input>
                            <button type="submit" className='btn btn-success mt-0 ml-2 w-100'>Sử dụng điểm</button>
                        </div>
                    </form>

                           
                    </div>

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
