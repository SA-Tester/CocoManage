import React, { lazy } from "react";
import img1 from "../assets/image1.jpg";
import { Label, TextInput, Button } from "flowbite-react";

const SignUp = () => {
  return (
    <React.Fragment>
      <div className="bg-white">
        <section className=" grid grid-cols-12 overflow-hidden">
          {/*Sign up section*/}
          <div className="mt-6 col-span-12 px-24 py-10 rounded-md bg-white  shadow-md md:col-span-6 lg:col-span-6">
            <h1 className="text-xl text-center font-bold text-green md:text-2xl xl:text-3xl">
              Welcome to CoCoManage
            </h1>
            <p className="text-md mt-3 text-center text-gray-700">
              Already have an account?
              <span>
                <a href="/login" className="text-light-green underline ml-1">
                  Login here
                </a>
              </span>
            </p>

            {/*Registration from*/}
            <form className="flex items-center justify-center">
              <div className="w-full pt-5 ">
                {/*full name*/}
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="full_name"
                      value="full name"
                      className="capitalize"
                    />
                  </div>
                  <TextInput
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    color={"dark"}
                  />
                </div>
                {/*email*/}
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="email"
                      value="email"
                      className="capitalize"
                    />
                  </div>
                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder=""
                    required
                    color={"dark"}
                  />
                </div>
                {/*password*/}
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="password"
                      value="Password"
                      className="capitalize"
                    />
                  </div>
                  <TextInput
                    id="password"
                    name="password"
                    type="password"
                    required
                    color={"dark"}
                  />
                </div>
                {/*Confirm Password*/}
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="confirm_password"
                      value="Confirm Password"
                      className="capitalize"
                    />
                  </div>
                  <TextInput
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    required
                    color={"dark"}
                  />
                </div>
                {/*button*/}
                <section className="mt-9 flex items-start justify-end">
                  <Button
                    size={"xs"}
                    className="w-full rounded-lg bg-green py-1 uppercase text-white hover:!bg-light-green"
                  >
                    Sign Up
                  </Button>
                </section>
              </div>
            </form>
          </div>

          {/*image section*/}
          <div className="col-span-12 md:col-span-6  lg:col-span-6">
            <img src={img1} alt="Coconut Trees" className="w-full h-auto" />
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default SignUp;
