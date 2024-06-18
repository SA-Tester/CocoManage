import { React, useState } from "react";
import cartIcon from '../assets/cart-icon.png';
import coconutPlant from '../assets/coconut-plant.jpg';

const Cart = () => {

    const totalPrice = 0;

    return (
        <div className="flex flex-col justify-between bg-green lg:flex-row p-8 text-black lg:items-center gap-8 absolute left-0 w-full max-h-fit lg:align-middle">
            {totalPrice == 0 ? <CartWithItems /> : (
                <div className="mx-auto text-center bg-white p-20 rounded-xl">
                    <img src={cartIcon} alt="icon" className="w-48 mx-auto" />
                    <div className="mt-4">
                        <h4 className="text-3xl">Your cart is empty.</h4>
                    </div>
                </div>
            )}
        </div>
    );
}

const CartWithItems = () => {
    const [amount, setAmount] = useState(1);

    return (
        <div className="flex flex-col container my-5 mx-3 justify-center gap-8 lg:flex-row align-middle">
            <div className="bg-white rounded-xl text-black px-12 py-6 w-full lg:w-1/2">
                <h4 className="text-3xl font-semibold text-black-600">My Cart</h4>
                <div className="flex flex-col lg:flex-row items-center justify-around mt-8">
                    <img src={coconutPlant} alt="icon" className="w-12 h-12 rounded-full mx-2" />
                    <h6 className="mx-2 text-gray-500  mt-3 lg:mt-0">{"Coconut Plant"}</h6>
                    <div className='flex flex-row items-center mx-2 mt-3 lg:mt-0'>
                        <button className='bg-green-500 py-1 px-4 rounded-lg text-white text-3xl' onClick={() => setAmount((prev) => prev - 1)}>-</button>
                        <span className='py-4 px-6 rounded-lg text-gray-500'>{amount}</span>
                        <button className='bg-green-500 py-1 px-3 rounded-lg text-white text-3xl' onClick={() => setAmount((prev) => prev + 1)}>+</button>
                    </div>
                    <div className="flex flex-row gap-3">
                        <button className='bg-white border-2 mt-3 lg:mt-0 border-green-500 text-green-500 font-semibold py-2 px-6 rounded-xl'>Edit</button>
                        <button className='bg-white border-2 mt-3 lg:mt-0 border-red-500 text-red-500 font-semibold p-2 rounded-xl'>Remove</button>
                    </div>
                </div>
                <div className="flex flex-row mt-8 p-6 justify-around">
                    <div className="text-gray-500 w-1/2 text-left mx-auto">
                        <h6 className="text-lg">Unit price</h6>
                        <h6 className="text-lg">Quantity</h6>
                        <hr className="p-1 w-full text-gray-500 m-1" />
                        <h6 className="text-lg">Total price</h6>
                    </div>
                    <div className="text-gray-500 w-1/2 text-right">
                        <h6 className="text-lg">Rs. 750.00</h6>
                        <h6 className="text-lg">2</h6>
                        <hr className="p-1 w-full text-gray-500 m-1" />
                        <h6 className="text-lg">Rs.1500.00</h6>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl text-black px-12 py-6 w-full lg:w-1/2">
                <h4 className="text-3xl font-semibold text-black-600 mb-5">Checkout</h4>
                <form action="">
                    <div className="grid grid-cols-2 gap-5">
                        <input type="text" name="" id="" placeholder="First name" className="border border-gray-400 py-2 px-2 rounded-md" />
                        <input type="text" name="" id="" placeholder="Last name" className="border border-gray-400 py-2 px-2 rounded-md" />
                    </div>
                    <div className="mt-5">
                        <input type="text" name="" id="" placeholder="Email" className="border border-gray-400 py-2 px-2 w-full rounded-md" />
                    </div>
                    <div className="mt-5">
                        <input type="text" name="" id="" placeholder="Phone" className="border border-gray-400 py-2 px-2 w-full rounded-md" />
                    </div>
                    <h3 className="my-4 text-gray-700 font-2xl">Delivery</h3>
                    <div className="mt-5 border border-green-500 bg-green-100 py-2 px-2 w-full rounded-md flex flex-row gap-4 align-middle items-center">
                        <input type="radio" name="delivary" id="pickup" value="pickup" className="text-green-500 py-2 px-2 rounded-full  focus:ring-green-500" checked/>
                        <label htmlFor="pickup" className="text-gray-700 w-full">Pick up in the state</label>
                    </div>
                    <h3 className="my-4 text-gray-700 font-2xl">Payment</h3>
                    <div className="border border-gray-400 rounded-md mb-5">
                        <div className="py-2 px-2 w-full flex flex-row gap-4 align-middle items-center border-b border-b-gray-400">
                            <input type="radio" name="payment" id="bank" value="bank" className="text-green-500 py-2 px-2 rounded-full focus:ring-green-500"/>
                            <label htmlFor="bank" className="text-gray-700 w-full">Bank Deposit</label>
                        </div>
                        <div className='py-2 px-2 w-full rounded-md flex flex-row gap-4 align-middle items-center'>
                            <input type="radio" name="payment" id="cod" value="cod" className="text-green-500 py-2 px-2 rounded-full focus:ring-green-500"/>
                            <label htmlFor="cod" className="text-gray-700 w-full">Cash on Delivery</label>
                        </div>
                    </div>
                </form>
                <button className='bg-green-500 text-white font-semibold w-full py-3 rounded-xl justify-around'>Complete Order</button>
            </div>
        </div>
    )
}

export default Cart;