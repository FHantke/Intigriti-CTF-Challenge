import React, { useState, useContext, createContext, useEffect } from "react";
import { UserContext } from "..";
import {useNavigate} from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from "react-router-dom";

const GET_USER = gql`
query user {
    me {
        success
        errors
        user { id name money age country language }
    }
}
`;

const UPDATE_USER = gql`
mutation update_user($userId: UUID, $name: String, $input: UserInput! ) {
    user(userId:$userId, name:$name, input:$input) {
        success
        errors
        user { id name money age country language }
    }
}
`;

function SettingsInfo() {

    const context = useContext(UserContext);
    const navigate = useNavigate();

    const [loaded, setLoaded] = useState(false);

    const [uid, setUid] = useState(-1);

    const [username, setUsername] = useState('');
    const [age, setAge] = useState(0);
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState('');

    const [ mutateUser, userLoading ] = useMutation(UPDATE_USER);

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { userId: context.userService.apiKey },
    });

    useEffect(()=> {
        if (!loaded && data && data.me.success) {
            setUsername(data.me.user.name)
            setAge(data.me.user.age)
            setCountry(data.me.user.country)
            setLanguage(data.me.user.language)
            setUid(data.me.user.id)

            context.userService.setLng(data.me.user.language);

            setLoaded(true);
        }
    });

    if (loading) return 'Loading';
    if (error) return `Error! ${error}`;
    if (data.me.success == false) return `Error! ${data.me.errors}`;

    const handleSave = (event) => {
        let input = {age: parseInt(age), language: language, country: country, name:username}
        mutateUser({ variables: {userId: uid, input: input}, onCompleted: (d) => {
          console.log(d);
          if (d.user.success === true) {

            setUsername(d.user.name)
            setAge(d.user.age)
            setCountry(d.user.country)
            setLanguage(d.user.language)
            setUid(d.user.id)

            navigate('/home', {replace: true});
          } else {
            console.log(d.user.errors[0])
          }
        }})

        if (userLoading.error) console.log(userLoading.error.message);
    };


    return (
        <>
        <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
            <div className="grid grid-cols-2 gap-4">                
                <div>
                    <p className="text-3xl text-gray-700 font-bold mb-5">
                        Settings
                    </p>
                </div>

                <div></div>

                <div>                    
                    <p className="text-gray-500 text-lg">
                        Username
                    </p>
                </div>
                <div>                                     
                    <input type="text" name="username" id="username" className="input input-bordered w-full" 
                        onInput={e => setUsername(e.target.value)} value={username}/>
                </div>

                <div>                    
                    <p className="text-gray-500 text-lg">
                        Age
                    </p>
                </div>
                <div>                                            
                    <input type="text" name="age" id="age" className="input input-bordered w-full" 
                        onInput={e => setAge(e.target.value)} value={age}/>
                </div>

                <div>                    
                    <p className="text-gray-500 text-lg">
                        Country
                    </p>
                </div>
                <div>                                            
                    <input type="text" name="country" id="country" className="input input-bordered w-full" 
                        onInput={e => setCountry(e.target.value)} value={country}/>
                </div>

                <div>                    
                    <p className="text-gray-500 text-lg">
                        Language
                    </p>
                </div>
                <div>              
                    <select name="country" id="country" className="select select-bordered w-full max-w-xs"
                        onChange={e => setLanguage(e.target.value)} value={language}>
                        <option>de</option>
                        <option>en</option>
                        <option>fr</option>
                    </select>                                     
                </div>

                <div>
                    <Link className="btn btn-block btn-primary" to="/home">Back</Link>
                </div>
                <div>
                    <button onClick={handleSave}  className="btn btn-primary btn-block ">Save</button>
                </div>
            </div>
        </div>
        </>
    );
}

export default SettingsInfo;