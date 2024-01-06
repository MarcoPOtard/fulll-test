import {useEditModeContext} from "../components/context/editModeContext";

export default function Header() {
    const editModeContext = useEditModeContext();
    return (
        <header className="header">
            <h1>Github Search</h1>
            <label className="header__edit-checkbox">
                <input type="checkbox" checked={editModeContext.state} onChange={() => editModeContext.setState(!editModeContext.state)}/>
                Edition
            </label>
        </header>
    );
}
