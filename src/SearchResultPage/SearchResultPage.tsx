import {ChangeEvent, useEffect, useRef, useState} from "react";
import {user} from "./interfaces/searchResultPageInterfaces";
import debounce from "../components/debounce";
import Checkbox from "../components/Checkbox/Checkbox";
import {useEditModeContext} from "../components/context/editModeContext";

export default function SearchResultPage() {
    const [searchValue, setSearchValue] = useState('');
    const [users, setUsers] = useState<user[]>([]);
    const [numberUsers, setNumberUsers] = useState(0);
    const [labelSelectedAll, setLabelSelectedAll] = useState('0 élément sélectionné')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [pageNumberToDisplay, setpageNumberToDisplay] = useState(1);
    const [resultsAreLoading, setResultsAreLoading] = useState(false);
    const resultsContainerRef = useRef<HTMLDivElement | null>(null);
    const resultsContainerScrollRef = useRef<HTMLDivElement | null>(null);
    const editModeContext = useEditModeContext();

    const handlerChangeSearch = debounce((value: string, pageNumber: number) => {
        let _value = value;
        setSearchValue(value);

        if (_value === '') {
            setUsers([]);
            return;
        }
        if (_value === undefined) {
            _value = searchValue;
        }
        setResultsAreLoading(true);
        fetch(`https://api.github.com/search/users?per_page=50&page=${pageNumber}&q=${_value}`)
            .then(response => response.json())
            .then(data => {
                if (data.items === undefined) {
                    return;
                }
                if (_value !== searchValue) {
                    setSearchValue(_value);
                    setUsers([...[], ...data.items]);
                    setSelectedUsers([]);
                    return;
                }
                setUsers([...users, ...data.items]);
            })
            .finally(() => setResultsAreLoading(false));
    }, 250);

    const selectAll = (value: boolean) => {
        if (value) {
            const ids = users.map((user) => user.id.toString());
            setSelectedUsers(ids);
            return;
        }
        setSelectedUsers([]);
    };

    const handleSelect = (value: boolean, name: string) => {
        if (value) {
            setSelectedUsers([...selectedUsers, name]);
            return;
        }
        setSelectedUsers(selectedUsers.filter((item) => item !== name));
    };

    const handleDeleted = () => {
        if (selectedUsers.length > 0) {
            setUsers(users.filter(user => !selectedUsers.includes(user.id.toString())));
        }
    }

    const handleDuplicate = () => {
        if (selectedUsers.length > 0) {
            const _selectedUsers = users.filter(user => selectedUsers.includes(user.id.toString()));
            const updateSelectedUsers = _selectedUsers.map((user) => {
                return {
                    ...user,
                    id: Date.now()
                }
            })
            setUsers([...users, ...updateSelectedUsers])
        }
    }

    const handleScroll = () => {
        let scroll = resultsContainerScrollRef.current?.clientHeight ?? 0;
        if (resultsContainerRef.current?.clientHeight) {
            scroll -= 3 * resultsContainerRef.current?.clientHeight;
        }
        if (resultsContainerRef.current?.scrollTop && scroll < resultsContainerRef.current?.scrollTop) {
            setpageNumberToDisplay(pageNumberToDisplay + 1);
            handlerChangeSearch(searchValue, pageNumberToDisplay + 1);
        }
    }

    useEffect(() => {
        setNumberUsers(users.length);
        if (resultsContainerRef) {
            const _scrollRef = resultsContainerRef.current;
            _scrollRef?.addEventListener('scroll', handleScroll);
            return () => {
                _scrollRef?.removeEventListener('scroll', handleScroll);
            };
        }
    }, [users]);

    useEffect(() => {
            setLabelSelectedAll(selectedUsers.length > 1 ? `${selectedUsers.length} éléments sélectionnés` : `${selectedUsers.length} élément sélectionné`)
    }, [selectedUsers])

    return (
        <div className="results__page">
            <form className="search-form">
                <label
                    htmlFor="search"
                    className="search-form__label"
                >
                    Rechercher un utilisateur sur Github
                </label>
                <input
                    id="search"
                    type="text"
                    placeholder="Marc, Mélisande, ..."
                    className="search-form__input"
                    onChange={(e:ChangeEvent<HTMLInputElement>) => handlerChangeSearch(e.target.value, pageNumberToDisplay)}
                />
            </form>

            {editModeContext.state &&
                <div className="edit-container">
                    <Checkbox
                        name="all"
                        value={users.length > 0 && selectedUsers.length === numberUsers}
                        updateValue={selectAll}
                        label={labelSelectedAll}
                    />
                    <div className="">
                        <button type="button" onClick={() => handleDuplicate()}>
                            {/*<img src={iconDuplicate} alt="Dupliquer les utilisateurs sélectionnés"/>*/}
                            <img src={process.env.PUBLIC_URL + '/images/icon-duplicate.png'}
                                 width="16"
                                 alt="Dupliquer les utilisateurs sélectionnés"
                                 title="Dupliquer les utilisateurs sélectionnés"
                            />
                        </button>
                        <button type="button" onClick={() => handleDeleted()}>
                            <img src={process.env.PUBLIC_URL + '/images/icon-trash.png'}
                                 width="16"
                                 alt="Supprimer les utilisateurs sélectionnés"
                                 title="Supprimer les utilisateurs sélectionnés"
                            />
                        </button>
                    </div>
                </div>
            }

            {(users.length > 0 || resultsAreLoading) &&
                <div className="results__container" ref={resultsContainerRef}>
                    <div className="results__container-scroll" ref={resultsContainerScrollRef} >
                        {users.map((user, index) => (
                            <div key={user.id} className="results__user">
                                {editModeContext.state &&
                                    <Checkbox name={user.id.toString()} value={selectedUsers.includes(user.id.toString())} updateValue={handleSelect}/>
                                }
                                <img
                                    src={user.avatar_url}
                                    alt={user.login}
                                    width="50" height="50"
                                    className="results__user-avatar"
                                />
                                <p className="results__user-id">{user.id}</p>
                                <p className="results__user-login">{user.login}</p>
                                <a href={user.url} className="results__user-button">Voir le profil</a>
                            </div>
                        ))}
                        {resultsAreLoading && <span className="loader"/>}
                    </div>
                </div>
            }
        </div>
    );
}
