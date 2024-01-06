import React from 'react';
import './App.css';
import Header from './Header/Header';
import SearchResultPage from "./SearchResultPage/SearchResultPage";
import {EditModeProvider} from "./components/context/editModeContext";

function App() {
    return (
        <div className="App">
            <EditModeProvider>
                <Header />
                <SearchResultPage />
            </EditModeProvider>
        </div>
    );
}


export default App;
