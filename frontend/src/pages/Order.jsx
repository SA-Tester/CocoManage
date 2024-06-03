import React, { useState } from 'react';
import coconutPlant from '../assets/coconut-plant.jpg';
import { Button } from "flowbite-react";
import { HiShoppingCart } from "react-icons/hi";

const Order = () => {
    const [quantity, setQuantity] = useState(5);

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0));
    };

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            setQuantity(value);
        }
    };

    return (
        <div className="left-0 w-full h-auto flex flex-col md:flex-row text-white absolute bg-green pl-5 pr-5">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
                <div className="flex flex-col justify-center">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-5xl dark:text-white">Order the High-Yielding Moorock Coconut Plant Now!</h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 text-left">Just Rs.750.00 per plant</p>

                    <form className="max-w-xs mx-auto">
                        <div className="flex items-center mb-4">
                            <label htmlFor="quantity-input" className="text-left block text-lg font-medium text-gray-900 dark:text-white mr-4">
                                Quantity
                            </label>
                            <div className="relative flex items-center">
                                <button
                                    type="button"
                                    id="decrement-button"
                                    onClick={handleDecrement}
                                    className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                >
                                    <svg className="w-3 h-3 text-gray-900 dark:text-green font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    id="quantity-input"
                                    value={quantity}
                                    onChange={handleChange}
                                    aria-describedby="helper-text-explanation"
                                    className="bg-green border-white h-11 text-center text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block w-11 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="5"
                                    required
                                />
                                <button
                                    type="button"
                                    id="increment-button"
                                    onClick={handleIncrement}
                                    className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                >
                                    <svg className="w-3 h-3 text-gray-900 dark:text-green font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button className='w-52 text-green bg-white rounded-md'>
                                <HiShoppingCart className="mr-2 h-5 w-5" />
                                Order now
                            </Button>
                        </div>
                    </form>
                    <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-left">
                        Minimum total order value is Rs.3500.00.
                    </p>
                </div>
                <div className="flex flex-col justify-center">
                    <img src={coconutPlant} alt="Coconut Plants" />
                </div>
            </div>
        </div>
    );
}

export default Order;
