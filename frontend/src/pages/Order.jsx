import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import coconutPlant from '../assets/coconut-plant.jpg';
import cartIcon from '../assets/cart-icon.png';
import axios from 'axios';
import { Alert } from "flowbite-react";

const Order = () => {

    const [amount, setAmount] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [notification, setNotification] = useState(0);
    const [unitPrice, setUnitPrice] = useState(0);
    const [maximumQuantity, setMaximumQuantity] = useState(1);


    useEffect(() => {
        const storedNotification = parseInt(localStorage.getItem('notification'), 10);
        const storedQuantity = parseInt(localStorage.getItem('quantity'), 10);
        if (storedNotification !== null) {
            console.log(storedNotification);
            setNotification(storedNotification);
        }

        if (storedQuantity !== null) {
            console.log(storedQuantity);
            setQuantity(storedQuantity);
        }
    }, []);


    function updateQuantity(id) {
        if (amount !== 0) {
            setQuantity(id);
            setNotification(1);
            localStorage.setItem('quantity', quantity);
            localStorage.setItem('notification', 1);
        }
    }

    function get_coconut_plant_count() {
        axios
            .get("http://localhost:8000/api/get_coconut_plant_count/")
            .then((response) => {
                setMaximumQuantity(response.data["Quantity"]);
                setUnitPrice(response.data["UnitPrice"]);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        get_coconut_plant_count();
    }, []);

    useEffect(() => {
        if (quantity > maximumQuantity) {
            setQuantity(0);
            setNotification(0);
            localStorage.setItem('quantity', 0);
            localStorage.setItem('notification', 0);
        }
    }, [maximumQuantity]);

    const navigate = useNavigate();
    const goToCart = () => {
        navigate('/cart', { replace: true, state: { quantity: quantity } })
    };

    return (
        <div className="flex flex-col justify-between bg-green lg:flex-row p-8 text-white lg:items-center gap-8 absolute left-0 w-full  max-h-fit lg:h-full">
            <div className='flex flex-col gap-6 lg:w-2/4 items-center'>
                <img src={coconutPlant} alt="Coconut Plants" className='w-5/6 h-5/6 aspect-square object-cover rounded-xl' />
            </div>
            <div className='flex flex-col gap-4 text-justify lg:w-2/4 items-start'>
                <Alert color="green" className={`${maximumQuantity !== 0 ? "hidden" : "mb-5"}`} withBorderAccent>
                    <h3 className='text-lg'>
                        Sorry, we are out of stock. Please check back later.
                    </h3>
                </Alert>
                <div>
                    <span className='text-green-400 font-semibold'>Unique Coconut Variety</span>
                    <h1 className='text-3xl font-bold text-white'>Moorock Cononut Plants</h1>
                </div>
                <p className='text-light-grey'>
                    Embrace excellence in coconut cultivation with the Moorock variety, a top performer in yield and quality for over a century.
                    Order the High-Yielding Moorock Coconut Plant Now!
                </p>
                <h6 className='text-2xl font-semibold'>Rs. {unitPrice}.00</h6>
                <div className='flex flex-row items-center gap-12'>
                    <div className='flex flex-row items-center'>
                        <button className='bg-white py-2 px-5 rounded-lg text-green-600 text-3xl' onClick={() => setAmount((prev) => Math.max(prev - 1, 0))}>-</button>
                        <span className='py-4 px-6 rounded-lg text-light-grey'>{amount}</span>
                        <button className='bg-white py-2 px-4 rounded-lg text-green-600 text-3xl' onClick={() => setAmount((prev) => Math.min(prev + 1, maximumQuantity))}>+</button>
                    </div>
                    <button className={`text-green-600 font-semibold py-4 px-16 rounded-xl h-full ${amount === 0 ? "bg-gray-300" : "bg-white"}`} onClick={() => updateQuantity({ amount })}>Add to Cart</button>
                    <div onClick={goToCart} className='w-10 h-10 bg-white rounded-full flex justify-center items-center relative'>
                        <img src={cartIcon} alt="" className='w-6' />
                        <span className={`absolute top-2/3 right-1/2 text-sm w-5 h-5 rounded-full flex justify-center items-center text-white ${quantity === 0 ? "bg-green-400" : "bg-red-500"}`}>{notification}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
