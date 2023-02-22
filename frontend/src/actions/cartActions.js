import axios from 'axios'
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartConstants'

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/course/${id}`)

    dispatch({
        type: ADD_TO_CART,
        payload: {
            course: data.details.course._id,
            name: data.details.course.name,
            price: data.details.course.price,
            image: data.details.course.images[0].url,
            
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeItemFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data))

}