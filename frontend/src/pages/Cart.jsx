import { React, useEffect, useState } from "react";
import cartIcon from '../assets/cart-icon.png';
import coconutPlant from '../assets/coconut-plant.jpg';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const Cart = () => {
    //get selected quantity value from order page
    const location = useLocation();
    console.log(location);
    const quantity = (location.state.quantity) === 0 ? (location.state.quantity) : ((location.state.quantity.amount)==null?(location.state.quantity):(location.state.quantity.amount));
    const [amount, setAmount] = useState(quantity);
    const totalPrice = amount * 750;

    useEffect(() => {
        localStorage.setItem('quantity',amount);
        if(amount > 0){
            localStorage.setItem('notification', 1);
        } else{
            localStorage.setItem('notification', 0);
        }
    }, [amount]);

    //set maximum quantity as the remaining coconut plant count 
    const[maximumQuantity, setMaximumQuantity] = useState(1);

    function get_coconut_plant_count() {
		axios
			.get("http://localhost:8000/api/get_coconut_plant_count/")
			.then((response) => {
				setMaximumQuantity(response.data["Quantity"]);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		get_coconut_plant_count();
	}, []);

    const navigate = useNavigate();
    const goToOrder = () => {
        navigate('/order')
    };

    return (
        <div className="flex flex-col justify-between bg-green lg:flex-row p-8 text-black lg:items-center gap-8 absolute left-0 w-full min-h-full max-h-fit lg:align-middle">
            {totalPrice == 0 ? (
                <div className="mx-auto text-center bg-white p-20 rounded-xl">
                    <img src={cartIcon} alt="icon" className="w-48 mx-auto" />
                    <div className="mt-4">
                        <h4 className="text-3xl">Your cart is empty :(</h4>
                    </div>
                    <button className='bg-green-500 text-white font-semibold w-full py-3 rounded-xl justify-around mt-8' onClick={goToOrder}>Go Back</button>
                </div>
            ) : (
                <div className="flex flex-col container my-5 mx-3 justify-center gap-8 lg:flex-row align-middle">
                    <div className="bg-white rounded-xl text-black px-12 py-6 w-full lg:w-1/2">
                        <h4 className="text-3xl font-semibold text-black-600">My Cart</h4>
                        <div className="flex flex-col lg:flex-row items-center justify-around mt-8">
                            <img src={coconutPlant} alt="icon" className="w-12 h-12 rounded-full mx-2" />
                            <h6 className="mx-2 text-gray-500  mt-3 lg:mt-0">{"Coconut Plant"}</h6>
                            <div className='flex flex-row items-center mx-2 mt-3 lg:mt-0'>
                                <button className='bg-green-500 py-1 px-4 rounded-lg text-white text-3xl' onClick={() => setAmount((prev) => Math.max(prev - 1, 1))}>-</button>
                                <span className='py-4 px-6 rounded-lg text-gray-500'>{amount}</span>
                                <button className='bg-green-500 py-1 px-3 rounded-lg text-white text-3xl' onClick={() => setAmount((prev) => Math.min(prev + 1, maximumQuantity))}>+</button>
                            </div>
                            <button className='bg-white border-2 mt-3 lg:mt-0 border-red-500 text-red-500 font-semibold p-2 rounded-xl' onClick={() => setAmount(0)}>Remove</button>
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
                                <h6 className="text-lg">{amount}</h6>
                                <hr className="p-1 w-full text-gray-500 m-1" />
                                <h6 className="text-lg">Rs.{totalPrice}.00</h6>
                            </div>
                        </div>
                        <button className='bg-green-500 text-white font-semibold w-full py-3 rounded-xl justify-around mt-8' onClick={goToOrder}>Go Back</button>
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
                                <input type="radio" name="delivary" id="pickup" value="pickup" className="text-green-500 py-2 px-2 rounded-full  focus:ring-green-500" defaultChecked />
                                <label htmlFor="pickup" className="text-gray-700 w-full">Pick up in the state</label>
                            </div>
                            <h3 className="my-4 text-gray-700 font-2xl">Payment</h3>
                            <div className="border border-gray-400 rounded-md mb-5">
                                <div className="py-2 px-2 w-full flex flex-row gap-4 align-middle items-center border-b border-b-gray-400">
                                    <input type="radio" name="payment" id="bank" value="bank" className="text-green-500 py-2 px-2 rounded-full focus:ring-green-500" />
                                    <label htmlFor="bank" className="text-gray-700 w-full">Bank Deposit</label>
                                </div>
                                <div className='py-2 px-2 w-full rounded-md flex flex-row gap-4 align-middle items-center'>
                                    <input type="radio" name="payment" id="cod" value="cod" className="text-green-500 py-2 px-2 rounded-full focus:ring-green-500" />
                                    <label htmlFor="cod" className="text-gray-700 w-full">Cash on Delivery</label>
                                </div>
                            </div>
                        </form>
                        <button className='bg-green-500 text-white font-semibold w-full py-3 rounded-xl justify-around'>Complete Order</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;