import React, { useState } from 'react';
import coconutPlant from '../assets/coconut-plant.jpg';
import cartIcon from '../assets/cart-icon.png';

const Order = () => {

    const[amount, setAmount] = useState(1);

    return (
        <div className="flex flex-col justify-between bg-green lg:flex-row p-8 text-white lg:items-center gap-8 absolute left-0 w-full h-full">
            <div className='flex flex-col gap-6 lg:w-2/4 items-center'>
                <img src={coconutPlant} alt="Coconut Plants" className='w-5/6 h-5/6 aspect-square object-cover rounded-xl' />
            </div>
            <div className='flex flex-col gap-4 text-justify lg:w-2/4'>
                <div>
                    <span className='text-green-400 font-semibold'>Unique Coconut Variety</span>
                    <h1 className='text-3xl font-bold text-white'>Moorock Cononut Plants</h1>

                </div>
                <p className='text-light-grey'>
                Embrace excellence in coconut cultivation with the Moorock variety, a top performer in yield and quality for over a century. 
                Order the High-Yielding Moorock Coconut Plant Now!
                </p>
                <h6 className='text-2xl font-semibold'>Rs. 750.00</h6>
                <div className='flex flex-row items-center gap-12'>
                    <div className='flex flex-row items-center'>
                        <button className='bg-white py-2 px-5 rounded-lg text-green-600 text-3xl' onClick={() => setAmount((prev)=>prev-1)}>-</button>
                        <span className='py-4 px-6 rounded-lg text-light-grey'>{amount}</span>
                        <button className='bg-white py-2 px-4 rounded-lg text-green-600 text-3xl' onClick={() => setAmount((prev)=>prev+1)}>+</button>
                    </div>
                    <button className='bg-white text-green-600 font-semibold py-4 px-16 rounded-xl h-full'>Add to Cart</button>
                    <div className='w-10 h-10 bg-white rounded-full flex justify-center items-center relative'>
                        <img src={cartIcon} alt="" className='w-6'/>
                        <span className='absolute top-2/3 right-1/2 bg-green-400 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center'>0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
