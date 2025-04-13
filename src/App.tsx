import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PostsList } from './pages/PostsList';
import { PostDetails } from './pages/PostDetails';

export const App = () => {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<PostsList />} />
                <Route path="table" element={<PostsList />} />
                <Route path="comment" element={<PostDetails />} />
            </Routes>
        </BrowserRouter>
    </>;
}