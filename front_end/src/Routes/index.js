import React from "react";


import { Route, Routes, } from 'react-router-dom';


import { Main, User } from "./pages";


const Router = () => {

    return (
        <div className="app">
            <Routes>
                <Route
                    path="/"
                    element={<Main
                    />}
                />
                <Route
                    path="/user"
                    element={<User/>}/>
            </Routes>
        </div>
    )
}

export default Router;